"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit2, Key, MessageSquare, Send, Loader2, X, Plus } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  created_at: string;
  updated_at: string;
};

export default function GuestbookPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Custom API wrapper
  const fetchEntries = async (): Promise<GuestbookEntry[]> => {
    const res = await fetch("/api/guestbook");
    if (!res.ok) throw new Error("Failed to fetch entries");
    return res.json();
  };

  const { data: entries, isLoading } = useQuery<GuestbookEntry[]>({
    queryKey: ["guestbook"],
    queryFn: fetchEntries,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const addMutation = useMutation({
    mutationFn: async (newEntry: any) => {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });
      if (!res.ok) {
         const d = await res.json();
         throw new Error(d.error || "Failed to add entry");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guestbook"] });
      setName("");
      setPassword("");
      setMessage("");
      toast({ title: "작성 완료", description: "방명록이 등록되었습니다." });
    },
    onError: (err: any) => {
      toast({ title: "에러", description: err.message, variant: "destructive" });
    }
  });

  // Edit/Delete Modal State
  const [selectedEntry, setSelectedEntry] = useState<GuestbookEntry | null>(null);
  const [modalMode, setModalMode] = useState<"edit" | "delete" | null>(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [editMessage, setEditMessage] = useState("");

  const editMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: any }) => {
      const res = await fetch(`/api/guestbook/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
         const d = await res.json();
         throw new Error(d.error || "Failed to update entry");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guestbook"] });
      closeModal();
      toast({ title: "수정 완료", description: "방명록이 수정되었습니다." });
    },
    onError: (err: any) => {
      toast({ title: "에러", description: err.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: any }) => {
      const res = await fetch(`/api/guestbook/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
         const d = await res.json();
         throw new Error(d.error || "Failed to delete entry");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guestbook"] });
      closeModal();
      toast({ title: "삭제 완료", description: "방명록이 삭제되었습니다." });
    },
    onError: (err: any) => {
      toast({ title: "에러", description: err.message, variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !password || !message) {
      toast({ title: "입력 오류", description: "모든 필드를 입력해주세요.", variant: "destructive" });
      return;
    }
    addMutation.mutate({ name, password, message });
  };

  const handleConfirmAction = () => {
    if (!selectedEntry) return;

    if (modalMode === "edit") {
      editMutation.mutate({ id: selectedEntry.id, payload: { message: editMessage, password: confirmPassword } });
    } else if (modalMode === "delete") {
      deleteMutation.mutate({ id: selectedEntry.id, payload: { password: confirmPassword } });
    }
  };

  const openModal = (entry: GuestbookEntry, mode: "edit" | "delete") => {
    setSelectedEntry(entry);
    setModalMode(mode);
    setEditMessage(entry.message);
    setConfirmPassword("");
  };

  const closeModal = () => {
    setSelectedEntry(null);
    setModalMode(null);
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-24">
      <Navigation />
      
      {/* Background Decorators */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue/20 blur-[120px] rounded-full point-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-cyan/20 blur-[120px] rounded-full point-events-none" />

      {/* Shared SVG Gradient for icons */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--deep-blue))" />
            <stop offset="100%" stopColor="hsl(var(--deep-purple))" />
          </linearGradient>
        </defs>
      </svg>

      <main className="flex-1 container mx-auto px-6 py-12 relative z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="gradient-text">Guestbook</span>
          </h1>
          <p className="text-foreground/60 text-lg">
            소인배에게 전하고 싶은 말을 남겨주세요.
          </p>
        </motion.div>

        {/* Write Button */}
        {!isFormOpen && (
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-cyan font-black rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" style={{ color: "black" }} />
              방명록 남기기
            </button>
          </div>
        )}

        {/* Input Form */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.form 
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              onSubmit={handleSubmit}
              className="glass-card p-6 md:p-8 mb-16 relative overflow-hidden"
            >
              {/* Subtle top border gradient */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-cyan to-brand-blue" />
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" /> 닉네임
              </label>
              <input
                type="text"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={30}
                className="bg-white/50 border border-white/40 focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-cyan/30 rounded-xl px-4 py-3 outline-none transition-all placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" /> 비밀번호
              </label>
              <input
                type="password"
                placeholder="수정/삭제 시 필요합니다"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={50}
                className="bg-white/50 border border-white/40 focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-cyan/30 rounded-xl px-4 py-3 outline-none transition-all placeholder:text-muted-foreground"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2 mb-6">
            <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" style={{ stroke: "url(#icon-gradient)" }} /> 메시지
            </label>
            <textarea
              rows={4}
              placeholder="따뜻한 한마디를 남겨주세요 :)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-white/50 border border-white/40 focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-cyan/30 rounded-xl px-4 py-3 outline-none transition-all resize-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-6 py-3 rounded-xl font-medium bg-black/5 hover:bg-black/10 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="w-full md:w-auto md:px-10 px-6 py-3 bg-black/5 from-brand-cyan to-brand-blue hover:from-brand-blue hover:to-brand-cyan text-black rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {addMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              등록하기
            </button>
          </div>
        </motion.form>
          )}
        </AnimatePresence>

        {/* Entries List */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-bold">방명록 목록</h2>
            <div className="px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-sm font-semibold">
              {entries?.length || 0}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
            </div>
          ) : entries && entries.length > 0 ? (
             entries.map((entry, idx) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card p-6 border-l-4 border-l-brand-cyan hover:border-l-brand-blue transition-colors group relative"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{entry.name}</h3>
                    <p className="text-xs text-foreground/50">
                      {new Date(entry.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal(entry, "edit")} className="p-2 bg-white/50 hover:bg-brand-blue/10 rounded-lg text-brand-blue transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => openModal(entry, "delete")} className="p-2 bg-white/50 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed">
                  {entry.message}
                </p>
              </motion.div>
             ))
          ) : (
             <div className="text-center py-20 glass-card">
                <MessageSquare className="w-12 h-12 mx-auto mb-4" style={{ stroke: "url(#icon-gradient)", opacity: 0.5 }} />
                <p className="text-foreground/60">아직 등록된 방명록이 없습니다.<br/>첫 번째 방명록을 남겨주세요!</p>
             </div>
          )}
        </div>
      </main>


      {/* Editor / Delete Modal */}
      <AnimatePresence>
        {selectedEntry && modalMode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card w-full max-w-md p-6 relative"
            >
              <button onClick={closeModal} className="absolute top-4 right-4 p-2 text-foreground/50 hover:text-foreground hover:bg-black/5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                {modalMode === "edit" ? <><Edit2 className="text-brand-cyan" /> 방명록 수정</> : <><Trash2 className="text-brand-blue" /> 방명록 삭제</>}
              </h3>

              {modalMode === "edit" && (
                <div className="mb-4">
                  <label className="text-sm font-semibold text-foreground/80 block mb-2">메시지</label>
                  <textarea
                    rows={4}
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                    className="w-full bg-white/50 border border-white/40 focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-cyan/30 rounded-xl px-4 py-3 outline-none resize-none"
                  />
                </div>
              )}

              <div className="mb-8">
                <label className="text-sm font-semibold text-foreground/80 block mb-2 flex items-center gap-1"><Key className="w-4 h-4"/> 비밀번호</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="작성 시 입력한 비밀번호"
                  className="w-full bg-white/50 border border-white/40 focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-cyan/30 rounded-xl px-4 py-3 outline-none"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeModal}
                  className="px-5 py-2 rounded-xl font-medium bg-black/5 hover:bg-black/10 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleConfirmAction}
                  disabled={editMutation.isPending || deleteMutation.isPending || !confirmPassword}
                  className={`px-5 py-2 rounded-xl font-medium text-white transition-colors flex items-center gap-2 ${
                    modalMode === 'edit' ? 'bg-brand-cyan hover:bg-brand-cyan/90' : 'bg-red-500 hover:bg-red-600'
                  } disabled:opacity-70`}
                >
                  {(editMutation.isPending || deleteMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {modalMode === "edit" ? "수정하기" : "삭제하기"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
