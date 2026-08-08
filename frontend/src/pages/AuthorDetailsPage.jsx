import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Mail, ArrowLeft, BookOpen } from "lucide-react";

const AuthorDetailsPage = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchAuthor = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}//api/author/${id}`);
        const data = await response.json();
        setAuthor(data);
      } catch (err) {
        console.error("Failed to fetch author details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthor();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#f8fafc] flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-[#43C6AC]/30 border-t-[#43C6AC] rounded-full animate-spin"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!author) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#f8fafc] flex justify-center items-center flex-col">
          <h2 className="text-2xl font-bold text-gray-700">Author not found</h2>
          <Link to="/authors" className="mt-4 text-[#43C6AC] hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Authors
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f0fdfa] pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-5xl mx-auto">
          <Link to="/authors" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#43C6AC] transition-colors mb-8 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to all authors
          </Link>

          {/* Author Header */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#43C6AC]/10 mb-12 flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-48 h-48 flex-shrink-0 rounded-full border-4 border-[#f0fdfa] bg-gray-100 overflow-hidden shadow-lg">
              {author.image ? (
                <img 
                  src={(author.image.startsWith('http') ? author.image : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}${ author.image.startsWith('/') ? '' : '/' }${author.image}`)} 
                  alt={author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-[#2B5876]">
                  {author.name.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-black text-[#2B5876] mb-2">{author.name}</h1>
              
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mb-6 font-medium">
                <Mail className="w-4 h-4 text-[#43C6AC]" />
                <span>{author.contact || 'No contact provided'}</span>
              </div>

              {author.bio && (
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 relative">
                  <span className="absolute top-2 left-4 text-4xl text-gray-300 font-serif leading-none">"</span>
                  <p className="text-gray-700 leading-relaxed text-lg italic px-4 relative z-10">
                    {author.bio}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Books Section */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="w-8 h-8 text-[#43C6AC]" />
              <h2 className="text-3xl font-bold text-[#2B5876]">Books by {author.name}</h2>
            </div>

            {author.bookList && author.bookList.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {author.bookList.map((book) => (
                  <Link to={`/books`} key={book._id} className="group bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-full aspect-[2/3] mb-4 overflow-hidden rounded-lg bg-gray-100 shadow-sm relative">
                      {book.image ? (
                        <img 
                          src={(book.image.startsWith('http') ? book.image : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}${ book.image.startsWith('/') ? '' : '/' }${book.image}`)} 
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                          <BookOpen className="w-8 h-8" />
                          <span className="text-sm">No cover</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-[#43C6AC] transition-colors">{book.title}</h3>
                    <p className="text-[#2B5876] font-semibold mt-2">₹{book.price}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
                <p className="text-gray-500 text-lg">No books found for this author yet.</p>
              </div>
            )}
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default AuthorDetailsPage;
