import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CheckCircle2, ShieldCheck, PenTool, PhoneCall, MessageCircle } from "lucide-react";

const PublishPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f0fdfa] pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 text-center md:text-left max-w-4xl relative">
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#43C6AC] to-[#2B5876] bg-clip-text text-transparent mb-4 leading-tight">
              Publish With Us
            </h1>
            <div className="h-1.5 w-24 bg-gradient-to-r from-[#43C6AC] to-[#F8FFAE] rounded-full mb-6 mx-auto md:mx-0" />
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
              We help writers turn ideas into polished work — whether you're a first-time author, a journalist, or an
              experienced academic. Fast review, friendly editorial support, and flexible publishing options.
            </p>
          </div>

          {/* Grid Layout for Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Card 1: Why publish with us? */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-[#43C6AC]/10 flex flex-col h-fit transition-transform hover:-translate-y-2 duration-300">
              <h2 className="text-2xl font-bold text-[#2B5876] mb-4 flex items-center gap-2">
                Why publish with us?
              </h2>
              <p className="text-gray-600 mb-8 text-base leading-relaxed">
                We focus on small-to-medium scale publications where quality meets discovery. Our editorial team ensures your voice is preserved while improving clarity, structure and reach. Publishing with us gives you:
              </p>
              
              <div className="space-y-6 mb-8 flex-grow">
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 bg-[#43C6AC]/10 p-2 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-[#43C6AC]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Discoverability</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Distribution across our website, newsletter and partner channels to reach readers who care about your topic.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 bg-[#43C6AC]/10 p-2 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-[#43C6AC]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Copyright & Control</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">You retain the rights you want — choose exclusive or non-exclusive contracts, and decide how your work is licensed.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 bg-[#43C6AC]/10 p-2 rounded-lg">
                    <PenTool className="w-6 h-6 text-[#43C6AC]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Editorial Support</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Structural edits, copyediting, and optional developmental editing so your manuscript shines.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <button className="bg-gradient-to-r from-[#43C6AC] to-[#2B5876] text-white px-6 py-3 rounded-full font-medium text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                  Submit your proposal
                </button>
                <button className="text-sm font-semibold text-[#2B5876] hover:text-[#43C6AC] transition-colors underline-offset-4 hover:underline">
                  View royalties & pricing
                </button>
              </div>

              <div className="mt-auto p-4 bg-gradient-to-br from-[#43C6AC]/5 to-[#F8FFAE]/10 rounded-xl border border-[#43C6AC]/10">
                <p className="italic text-gray-700 text-sm font-medium">
                  "I appreciated how hands-on the editors were — my article found the right readers." 
                  <span className="block mt-2 text-xs text-gray-500 font-normal">— A recent author</span>
                </p>
              </div>
            </div>

            {/* Card 2: What do we provide? */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-[#43C6AC]/10 flex flex-col h-fit transition-transform hover:-translate-y-2 duration-300">
              <h2 className="text-2xl font-bold text-[#2B5876] mb-3">What do we provide?</h2>
              <p className="text-gray-600 mb-4 text-base leading-relaxed">
                A clear, author-friendly suite of services for every stage: from proposal review to promotion after publication.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="px-3 py-1 bg-[#F8FFAE]/50 text-[#2B5876] text-xs font-semibold rounded-full border border-[#43C6AC]/20">Proposal review (72 hrs)</span>
                <span className="px-3 py-1 bg-[#F8FFAE]/50 text-[#2B5876] text-xs font-semibold rounded-full border border-[#43C6AC]/20">Editorial packages</span>
                <span className="px-3 py-1 bg-[#F8FFAE]/50 text-[#2B5876] text-xs font-semibold rounded-full border border-[#43C6AC]/20">Design & typesetting</span>
                <span className="px-3 py-1 bg-[#F8FFAE]/50 text-[#2B5876] text-xs font-semibold rounded-full border border-[#43C6AC]/20">Marketing support</span>
              </div>

              <div className="mb-5">
                <h3 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#43C6AC]" /> Included services
                </h3>
                <ul className="space-y-1 text-sm text-gray-600 ml-4 border-l-2 border-[#43C6AC]/20 pl-4">
                  <li className="relative before:absolute before:-left-[21px] before:top-2 before:w-2 before:h-2 before:bg-[#43C6AC] before:rounded-full">One round of developmental feedback</li>
                  <li className="relative before:absolute before:-left-[21px] before:top-2 before:w-2 before:h-2 before:bg-[#43C6AC] before:rounded-full">Two rounds of copyedits</li>
                  <li className="relative before:absolute before:-left-[21px] before:top-2 before:w-2 before:h-2 before:bg-[#43C6AC] before:rounded-full">Professional cover & layout (where applicable)</li>
                  <li className="relative before:absolute before:-left-[21px] before:top-2 before:w-2 before:h-2 before:bg-[#43C6AC] before:rounded-full">Feature in our monthly newsletter</li>
                </ul>
              </div>

              <div className="mb-5">
                <h3 className="font-bold text-gray-900 text-lg mb-1">Flexible offerings</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Choose a basic free listing, a paid feature package, or a full-service publishing deal depending on your goals.
                </p>
              </div>

              <div className="mb-5">
                <h3 className="font-bold text-gray-900 text-lg mb-1">How we help authors get found</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  SEO optimization, curated categories, social promotion, and outreach to subject-matter newsletters and reviewers.
                </p>
              </div>

              <div className="mt-10 pt-4 border-t border-gray-100">
                <h3 className="font-bold text-[#2B5876] text-lg mb-1">Have questions?</h3>
                <p className="text-sm text-gray-600">
                  Email us at <a href="mailto:vedicpublication@gmail.com" className="text-[#43C6AC] font-semibold hover:underline">vedicpublication@gmail.com</a> or use the form below.
                </p>
              </div>
            </div>
            {/* Card 3: How we make the publication process easy */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-[#43C6AC]/10 transition-transform hover:-translate-y-2 duration-300 h-fit">
              <h2 className="text-2xl font-bold text-[#2B5876] mb-4">How we make the publication process easy</h2>
              <p className="text-gray-600 mb-6 text-base leading-relaxed">
                We keep the steps simple and transparent. Most proposals are reviewed within 72 hours and the full timeline is shared before work begins.
              </p>
              
              <div className="space-y-4 mb-6">
                {[
                  { title: "Submit", desc: "Send a short proposal or manuscript sample via the form below." },
                  { title: "Review", desc: "Editorial team provides feedback and a suggested plan." },
                  { title: "Revise", desc: "Work with an editor on one or more rounds of edits." },
                  { title: "Publish", desc: "Design, proofing, and release. We promote your work to our channels." }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#43C6AC] to-[#2B5876] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <strong className="text-gray-900 block mb-1">{step.title}</strong>
                      <span className="text-sm text-gray-600">{step.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-gray-600 leading-relaxed font-medium bg-[#43C6AC]/5 p-4 rounded-xl text-center border border-[#43C6AC]/10">
                We offer milestone updates and a single point of contact so nothing gets lost in emails.
              </p>
            </div>

            {/* Right Column Stack */}
            <div className="flex flex-col gap-8 h-fit">
              {/* Card 4: Pricing & Royalties */}
              <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-[#43C6AC]/10 transition-transform hover:-translate-y-2 duration-300 h-fit">
                <h2 className="text-2xl font-bold text-[#2B5876] mb-4">Pricing & Royalties</h2>
                <p className="text-gray-600 mb-8 text-base leading-relaxed">
                  We offer several pricing models to fit different author needs. Below are common options — contact us for a custom quote.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-b from-gray-50 to-white border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 text-base mb-2">Free Listing</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">Basic publication, no promotional package. Royalties negotiated case-by-case.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-b from-[#43C6AC]/5 to-white border border-[#43C6AC]/20 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#43C6AC] to-[#2B5876]"></div>
                    <h3 className="font-bold text-[#2B5876] text-base mb-2 mt-1">Feature Package</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">One-time fee + revenue share. Includes newsletter feature and social push.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-b from-gray-50 to-white border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 text-base mb-2">Full Service</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">Custom pricing — design, editing, distribution, and marketing included.</p>
                  </div>
                </div>
              </div>

              {/* Card 5: Contact us to publish */}
              <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-[#43C6AC]/10 transition-transform hover:-translate-y-2 duration-300">
                <h2 className="text-2xl font-bold text-[#2B5876] mb-4">Contact us to publish</h2>
                <p className="text-gray-600 mb-4 text-base leading-relaxed">
                  Since the site is not accepting online submissions yet, you can reach us directly through WhatsApp or phone call for quick communication.
                </p>
                
                <div className="flex flex-col gap-3">
                  <a href="tel:+917007470800" className="flex-1 flex items-center gap-4 bg-white p-4 rounded-2xl border-2 border-gray-100 hover:border-[#43C6AC]/40 hover:shadow-md transition-all group">
                    <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <PhoneCall className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 font-medium">Call Us Directly</div>
                      <div className="text-lg font-bold text-gray-900 group-hover:text-[#43C6AC] transition-colors">+91 6203xxxx18</div>
                    </div>
                  </a>
                  
                  <a href="https://wa.me/917007470800" target="_blank" rel="noreferrer" className="flex-1 flex items-center gap-4 bg-white p-4 rounded-2xl border-2 border-gray-100 hover:border-[#25D366]/40 hover:shadow-md transition-all group">
                    <div className="w-12 h-12 rounded-full bg-green-50 text-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 font-medium">WhatsApp Support</div>
                      <div className="text-lg font-bold text-gray-900 group-hover:text-[#25D366] transition-colors">Message us now</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PublishPage;
