"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit2, Key, Image as ImageIcon, Send, Loader2, X, UploadCloud, Plus } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { supabaseClient } from "@/lib/supabase/client";

type GalleryItem = {
  id: string;
  title: string;
  caption?: string;
  imagePath: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export default function GalleryPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchGallery = async (): Promise<GalleryItem[]> => {
    const res = await fetch("/api/gallery");
    if (!res.ok) throw new Error("Failed to fetch gallery items");
    return res.json();
  };

  const { data: items, isLoading } = useQuery<GalleryItem[]>({
    queryKey: ["gallery"],
    queryFn: fetchGallery,
  });

  // Upload state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const clearUpload = () => {
    setFile(null);
    setPreviewUrl(null);
    setTitle("");
    setCaption("");
    setPassword("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("파일을 선택해주세요.");

      // 1. Get signed url
      const signRes = await fetch("/api/storage/signed-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, contentType: file.type }),
      });
      
      if (!signRes.ok) {
        const err = await signRes.json();
        throw new Error(err.error || "Signed URL 발급 실패");
      }
      
      const { path, token } = await signRes.json();

      // 2. Upload file directly to supabase storage
      const { error: uploadErr } = await supabaseClient.storage
        .from("gallery") // Assumes public bucket named exactly 'gallery'
        .uploadToSignedUrl(path, token, file);

      if (uploadErr) throw new Error("파일 업로드 실패: " + uploadErr.message);

      // 3. Save metadata
      const metaRes = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          caption,
          password,
          imagePath: path,
        }),
      });

      if (!metaRes.ok) {
         const err = await metaRes.json();
         throw new Error(err.error || "게시물 등록 실패");
      }
      return metaRes.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      clearUpload();
      setIsFormOpen(false);
      toast({ title: "업로드 완료", description: "갤러리에 이미지가 추가되었습니다." });
    },
    onError: (err: any) => {
      toast({ title: "업로드 실패", description: err.message, variant: "destructive" });
    }
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !password || !file) {
      toast({ title: "입력 오류", description: "제목, 비밀번호, 이미지를 모두 추가해주세요.", variant: "destructive" });
      return;
    }
    uploadMutation.mutate();
  };

  // Edit / Delete Modal State
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [modalMode, setModalMode] = useState<"edit" | "delete" | null>(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editCaption, setEditCaption] = useState("");

  const openModal = (item: GalleryItem, mode: "edit" | "delete") => {
    setSelectedItem(item);
    setModalMode(mode);
    setConfirmPassword("");
    if (mode === "edit") {
      setEditTitle(item.title);
      setEditCaption(item.caption || "");
    }
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalMode(null);
  };

  const editMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: any }) => {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
         const err = await res.json();
         throw new Error(err.error || "Failed to edit item");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      closeModal();
      toast({ title: "수정 완료", description: "갤러리 게시물이 수정되었습니다." });
    },
    onError: (err: any) => {
      toast({ title: "실패", description: err.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: any }) => {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
         const err = await res.json();
         throw new Error(err.error || "Failed to delete item");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      closeModal();
      toast({ title: "삭제 완료", description: "이미지가 삭제되었습니다." });
    },
    onError: (err: any) => {
      toast({ title: "실패", description: err.message, variant: "destructive" });
    }
  });

  const handleConfirmAction = () => {
    if (!selectedItem) return;
    if (modalMode === "edit") {
      editMutation.mutate({ id: selectedItem.id, payload: { title: editTitle, caption: editCaption, password: confirmPassword } });
    } else if (modalMode === "delete") {
      deleteMutation.mutate({ id: selectedItem.id, payload: { password: confirmPassword } });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-24">
      <Navigation />
      
      {/* Background Decorators */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-cyan/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[30%] h-[30%] bg-brand-blue/20 blur-[120px] rounded-full pointer-events-none" />

      <main className="flex-1 container mx-auto px-6 py-12 relative z-10 max-w-6xl">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="gradient-text">Gallery</span>
          </h1>
          <p className="text-foreground/60 text-lg">
            소인배의 활동 사진을 공유해주세요.
          </p>
        </motion.div>

        {/* Upload Button */}
        {!isFormOpen && (
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-cyan font-black rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" style={{ color: "black" }} />
              사진 올리기
            </button>
          </div>
        )}

        {/* Upload Form */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.form
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              onSubmit={handleUploadSubmit}
              className="glass-card p-6 md:p-8 mb-16 relative overflow-hidden mx-auto max-w-2xl"
            >
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue to-brand-cyan" />
           
           <div className="mb-6">
              <label 
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed ${previewUrl ? 'border-brand-blue bg-brand-blue/5' : 'border-white/40 hover:border-brand-cyan/50 bg-white/30 hover:bg-white/50'} rounded-2xl cursor-pointer transition-colors overflow-hidden relative`}
              >
                 {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                 ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-10 h-10 text-brand-blue mb-3" />
                      <p className="mb-2 text-sm text-foreground/70"><span className="font-semibold text-brand-cyan">클릭</span>하여 이미지 업로드</p>
                    </div>
                 )}
                 <input type="file" className="hidden" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
              </label>
           </div>

           <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" /> 제목
                </label>
                <input
                  type="text"
                  placeholder="사진 제목"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={60}
                  className="bg-white/50 border border-white/40 focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-cyan/30 rounded-xl px-4 py-3 outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" /> 비밀번호
                </label>
                <input
                  type="password"
                  placeholder="수정/삭제 시 필요합니다"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={50}
                  className="bg-white/50 border border-white/40 focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-cyan/30 rounded-xl px-4 py-3 outline-none"
                />
              </div>
           </div>

           <div className="flex flex-col gap-2 mb-6">
              <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                 <ImageIcon className="w-4 h-4 text-brand-blue" /> 설명 (선택)
              </label>
              <textarea
                rows={2}
                placeholder="사진에 대한 설명을 추가해주세요."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={300}
                className="bg-white/50 border border-white/40 focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-cyan/30 rounded-xl px-4 py-3 outline-none resize-none"
              />
           </div>

           <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-3 rounded-xl font-bold bg-black/5 hover:bg-black/10 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={uploadMutation.isPending}
                className="px-10 py-3 bg-black/5 hover:bg-black/10 text-black rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center gap-2"
              >
                {uploadMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                사진 등록하기
              </button>
           </div>
        </motion.form>
          )}
        </AnimatePresence>

        {/* Gallery Grid */}
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
               갤러리 <span className="px-3 py-1 bg-brand-cyan/10 text-brand-cyan rounded-full text-sm">{items?.length || 0}</span>
            </h2>

            {isLoading ? (
               <div className="flex justify-center py-20">
                 <Loader2 className="w-8 h-8 animate-spin text-brand-cyan" />
               </div>
            ) : items && items.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                 {items.map((item, idx) => (
                    <motion.div
                       key={item.id}
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ delay: idx * 0.05 }}
                       className="glass-card overflow-hidden group relative"
                    >
                       <div className="aspect-square w-full overflow-hidden bg-white/20 relative">
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                             <h3 className="text-white font-bold leading-tight line-clamp-2 shadow-sm">{item.title}</h3>
                             {item.caption && <p className="text-white/80 text-xs mt-1 line-clamp-1">{item.caption}</p>}
                          </div>
                       </div>
                       <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={(e) => { e.preventDefault(); openModal(item, "edit"); }} className="p-1.5 bg-black/40 backdrop-blur-md hover:bg-brand-cyan/80 rounded-lg text-white transition-colors">
                           <Edit2 className="w-4 h-4" />
                         </button>
                         <button onClick={(e) => { e.preventDefault(); openModal(item, "delete"); }} className="p-1.5 bg-black/40 backdrop-blur-md hover:bg-red-500/80 rounded-lg text-white transition-colors">
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                    </motion.div>
                 ))}
               </div>
            ) : (
               <div className="text-center py-20 glass-card">
                  <ImageIcon className="w-12 h-12 mx-auto text-brand-blue/50 mb-4" />
                  <p className="text-foreground/60">아직 등록된 사진이 없습니다.<br/>첫 번째 추억을 공유해주세요!</p>
               </div>
            )}
        </div>
      </main>


      {/* Editor / Delete Modal */}
      <AnimatePresence>
        {selectedItem && modalMode && (
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
                {modalMode === "edit" ? <><Edit2 className="text-brand-cyan" /> 제목/설명 수정</> : <><Trash2 className="text-brand-blue" /> 사진 삭제</>}
              </h3>

              {modalMode === "edit" && (
                <>
                  <div className="mb-4">
                     <label className="text-sm font-semibold text-foreground/80 block mb-2">제목</label>
                     <input
                       type="text"
                       value={editTitle}
                       onChange={(e) => setEditTitle(e.target.value)}
                       className="w-full bg-white/50 border border-white/40 focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-cyan/30 rounded-xl px-4 py-3 outline-none"
                     />
                  </div>
                  <div className="mb-4">
                     <label className="text-sm font-semibold text-foreground/80 block mb-2">설명</label>
                     <textarea
                       rows={2}
                       value={editCaption}
                       onChange={(e) => setEditCaption(e.target.value)}
                       className="w-full bg-white/50 border border-white/40 focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-cyan/30 rounded-xl px-4 py-3 outline-none resize-none"
                     />
                  </div>
                </>
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
                  className={`px-5 py-2 rounded-xl font-medium bg-black/5 hover:bg-black/10 transition-colors ${
                    modalMode === 'edit' ? 'bg-brand-blue hover:bg-brand-blue/90' : 'bg-red-500 hover:bg-red-600'
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
