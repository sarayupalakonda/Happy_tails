(function renderPublicFooter() {
  const mount = document.getElementById('public-footer');
  if (!mount) return;

  mount.innerHTML = `
    <footer class="public-footer bg-stone-900 text-stone-300 px-4 sm:px-8 py-10">
      <div class="max-w-7xl mx-auto">
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href="index.html" class="inline-flex items-center gap-2 text-xl font-bold text-white mb-3">
              <span class="text-2xl">🐾</span>
              <span>Happy<span class="text-orange-400">Tails</span></span>
            </a>
            <p class="text-stone-400 text-sm leading-relaxed max-w-xs">
              Helping street dogs and pets find loving homes.
            </p>
          </div>

          <div>
            <h4 class="font-semibold text-white mb-3">Quick Links</h4>
            <nav class="footer-links">
              <a href="index.html">Home</a>
              <a href="dogs.html">Find Dogs</a>
              <a href="about.html">About</a>
              <a href="contact.html">Contact</a>
            </nav>
          </div>

          <div>
            <h4 class="font-semibold text-white mb-3">Contact</h4>
            <div class="space-y-2 text-sm text-stone-400">
              <p><span class="text-orange-400 font-medium">Email:</span> hello@happytails.com</p>
              <p><span class="text-orange-400 font-medium">Phone:</span> +91 98765 43210</p>
              <p><span class="text-orange-400 font-medium">Location:</span> Hyderabad, Telangana</p>
            </div>
          </div>

          <div>
            <h4 class="font-semibold text-white mb-3">Adopt With Love</h4>
            <p class="text-stone-400 text-sm leading-relaxed">
              Browse, connect, and give a rescued dog a safe forever home.
            </p>
          </div>
        </div>

        <div class="mt-8 pt-5 border-t border-stone-700 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p class="text-stone-500 text-sm">© 2026 HappyTails. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;
})();
