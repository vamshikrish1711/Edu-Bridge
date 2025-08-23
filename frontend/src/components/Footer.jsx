export default function Footer() {
  return (
    <footer className="bg-white text-center py-4 mt-10 shadow-inner text-gray-600 text-sm">
      © {new Date().getFullYear()} EduBridge. All rights reserved.
    </footer>
  );
}