import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h5 className="text-2xl font-bold text-blue-400 mb-4">
              GlobalDramaVerseList
            </h5>
            <p className="text-slate-300 mb-4">
              Your ultimate destination for discovering the best Indian and global dramas, 
              movies, and series. Join millions of users exploring incredible stories from 
              around the world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h6 className="font-semibold mb-4">Browse</h6>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link href="/browse?country=India">
                  <a className="hover:text-white transition-colors">Indian Dramas</a>
                </Link>
              </li>
              <li>
                <Link href="/browse?country=South Korea">
                  <a className="hover:text-white transition-colors">Korean Dramas</a>
                </Link>
              </li>
              <li>
                <Link href="/browse?country=Japan">
                  <a className="hover:text-white transition-colors">Japanese Anime</a>
                </Link>
              </li>
              <li>
                <Link href="/browse?country=United States">
                  <a className="hover:text-white transition-colors">Western Movies</a>
                </Link>
              </li>
              <li>
                <Link href="/browse?filter=top-rated">
                  <a className="hover:text-white transition-colors">Top Rated</a>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="font-semibold mb-4">Support</h6>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community Guidelines</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2024 GlobalDramaVerseList. All rights reserved. Built with passion for storytelling.</p>
        </div>
      </div>
    </footer>
  );
}
