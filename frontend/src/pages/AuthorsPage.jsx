import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Mail, BookText } from "lucide-react";

const AuthorsPage = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchAuthors = async () => {
      try {
        const response = await fetch(`${(import.meta.env.VITE_BACKEND_URL ? (import.meta.env.VITE_BACKEND_URL.startsWith("http") ? import.meta.env.VITE_BACKEND_URL : "https://" + import.meta.env.VITE_BACKEND_URL) : "http://localhost:4000")}/api/author`);
        const data = await response.json();
        setAuthors(data);
      } catch (err) {
        console.error("Failed to fetch authors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthors();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f0fdfa] pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 text-center md:text-left max-w-4xl relative">
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#43C6AC] to-[#2B5876] bg-clip-text text-transparent mb-4 leading-tight">
              Meet Our Authors
            </h1>
            <div className="h-1.5 w-24 bg-gradient-to-r from-[#43C6AC] to-[#F8FFAE] rounded-full mb-6 mx-auto md:mx-0" />
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
              Discover the brilliant minds behind our publications. From experienced academics to debut storytellers, explore their work and connect.
            </p>
          </div>

          {/* Authors Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-[#43C6AC]/30 border-t-[#43C6AC] rounded-full animate-spin"></div>
            </div>
          ) : authors.length === 0 ? (
            <div className="text-center py-20 bg-white/50 rounded-3xl border border-[#43C6AC]/10">
              <p className="text-gray-500 text-lg">No authors found yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {authors.map((author) => (
                <Link to={`/author/${author._id}`} key={author._id} className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-[#43C6AC]/10 transition-all hover:-translate-y-2 duration-300 flex flex-col items-center justify-center group cursor-pointer hover:shadow-2xl">
                  {/* Author Image */}
                  <div className="w-auto h-auto rounded-full border-4 border-[#f0fdfa] bg-gray-100 overflow-hidden shadow-md mb-5 relative">
                    {author.image ? (
                      <img 
                        src={(author.image.startsWith('http') ? author.image : `${(import.meta.env.VITE_BACKEND_URL ? (import.meta.env.VITE_BACKEND_URL.startsWith("http") ? import.meta.env.VITE_BACKEND_URL : "https://" + import.meta.env.VITE_BACKEND_URL) : "http://localhost:4000")}${ author.image.startsWith('/') ? '' : '/' }${author.image}`)} 
                        alt={author.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#43C6AC] to-[#2B5876] flex items-center justify-center text-4xl font-bold text-white">
                        {author.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  {/* Author Name */}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-[#2B5876] group-hover:text-[#43C6AC] transition-colors">{author.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AuthorsPage;
