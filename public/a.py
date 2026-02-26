from PIL import Image, ImageOps
import os

def process_directory(input_dir, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    supported_formats = ('.jpg', '.jpeg', '.png')

    for filename in os.listdir(input_dir):
        if filename.lower().endswith(supported_formats):
            input_path = os.path.join(input_dir, filename)
            output_filename = os.path.splitext(filename)[0] + '.webp'
            output_path = os.path.join(output_dir, output_filename)
            convert_to_webp(input_path, output_path)

def convert_to_webp(input_path, output_path):
    try:
        with Image.open(input_path) as image:
            # ✅ EXIF 회전 정보를 실제 이미지에 적용
            image = ImageOps.exif_transpose(image)

            # 투명 PNG/JPEG 처리
            if image.mode in ('RGBA', 'LA'):
                background = Image.new('RGB', image.size, (255, 255, 255))
                background.paste(image, mask=image.split()[-1])
                image = background
            else:
                image = image.convert('RGB')

            image.save(output_path, 'WEBP', quality=80, method=6)
            print(f"변환 성공: {input_path} -> {output_path}")

    except Exception as e:
        print(f"변환 실패: {input_path}, 에러: {str(e)}")

if __name__ == "__main__":
    input_directory = "./"
    output_directory = "images"
    process_directory(input_directory, output_directory)