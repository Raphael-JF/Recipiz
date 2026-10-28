
<template>
  <nav class="navbar" @keydown.esc="closeMenus">
    <!-- Logo -->
    <RouterLink to="/" class="logo" @click="closeMenus">
      🍳 Recipiz
    </RouterLink>

    <!-- Navigation ordinateur -->
    <div class="desktop-nav">
      <div class="nav-item">
        <button
          class="nav-button"
          :aria-expanded="recipesOpen"
          @click="toggleRecipes"
        >
          <BookOpen :size="20" />
          <span>Recettes</span>
          <ChevronDown :size="15" />
        </button>

        <div class="dropdown" :class="{ 'is-open': recipesOpen }">
          <RouterLink to="/" @click="closeMenus">
            <Globe :size="20" />
            Toutes les recettes
          </RouterLink>
          <RouterLink to="/my-recipes" @click="closeMenus">
            <SquareLibrary :size="20" />
            Mes recettes
          </RouterLink>
          <RouterLink to="/recipe/new" @click="closeMenus">
            <NotebookPen :size="20" />
            Créer une recette
          </RouterLink>
        </div>
      </div>

      <div class="nav-item">
        <template v-if="auth.user_data">
          <button
            class="nav-button"
            :aria-expanded="accountOpen"
            @click="toggleAccount"
          >
            <UserRound :size="20" />
            <span> {{ auth.user_data.username }} </span>
            <ChevronDown :size="15" />
          </button>

          <div class="dropdown" :class="{ 'is-open': accountOpen }">
            <button class="dropdown-action" @click="logout">
              <LogOut :size="17" />
              <span>Déconnexion</span>
            </button>
          </div>
        </template>

        <RouterLink v-else to="/login" class="login-button">
          <LogIn :size="20" />
          Connexion
        </RouterLink>
      </div>
    </div>

    <!-- Bouton hamburger mobile -->
    <button
      class="hamburger"
      :class="{ active: menuOpen }"
      :aria-expanded="menuOpen"
      aria-label="Ouvrir le menu"
      @click="toggleMenu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Fond sombre du menu mobile -->
    <div
      v-if="menuOpen"
      class="drawer-backdrop"
      @click="closeMenus"
    ></div>

    <!-- Menu latéral mobile -->
    <aside class="mobile-drawer" :class="{ 'is-open': menuOpen }" @keydown.esc="closeMenus">
      <div class="drawer-header">
        <span class="drawer-title">Menu</span>
        <button
          class="close-button"
          aria-label="Fermer le menu"
          @click="closeMenus"
        >
          ✕
        </button>
      </div>

      <div class="mobile-nav-item">
        <button
          class="mobile-nav-button"
          :aria-expanded="recipesOpen"
          @click="toggleRecipes"
        >
          Recettes
          <span class="chevron">{{ recipesOpen ? '▴' : '▾' }}</span>
        </button>

        <div v-if="recipesOpen" class="mobile-submenu">
          <RouterLink to="/" @click="closeMenus">
            Toutes les recettes
          </RouterLink>
          <RouterLink to="/my-recipes" @click="closeMenus">
            Mes recettes
          </RouterLink>
        </div>
      </div>

      <div class="mobile-nav-item">
        <template v-if="auth.user_data">
          <button
            class="mobile-nav-button"
            :aria-expanded="accountOpen"
            @click="toggleAccount"
          >
            {{ auth.user_data.username }}
            <span class="chevron">{{ accountOpen ? '▴' : '▾' }}</span>
          </button>

          <div v-if="accountOpen" class="mobile-submenu">
            <button class="dropdown-action" @click="logout">
              Déconnexion
            </button>
          </div>
        </template>

        <RouterLink
          v-else
          to="/login"
          class="mobile-nav-button"
          @click="closeMenus"
        >
          Connexion
        </RouterLink>
      </div>
    </aside>
  </nav>
</template>

<script>
import { RouterLink } from 'vue-router'
import { auth } from '@/auth'
import api from '@/services/api'
import {
  BookOpen,
  UserRound,
  LogIn,
  LogOut,
  ChevronDown,
  ChefHat,
  NotebookPen,
  Globe,
  SquareLibrary
} from 'lucide-vue-next'

export default {
  components: {
    BookOpen,
    UserRound,
    LogIn,
    LogOut,
    ChevronDown,
    ChefHat,
    NotebookPen,
    Globe,
    SquareLibrary,
    RouterLink
  },

  data() {
    return {
      auth,
      menuOpen: false,
      recipesOpen: false,
      accountOpen: false,

      navigation: [
        {
          label: 'Recettes',
          icon: BookOpen,
          children: [
            {
              label: 'Toutes les recettes',
              to: '/',
              icon: Globe
            },
            {
              label: 'Mes recettes',
              to: '/my-recipes',
              icon: SquareLibrary
            },
            {
              label: 'Créer une recette',
              to: '/recipe/new',
              icon: NotebookPen
            }
          ]
        },
        {
          label: 'Compte',
          icon: UserRound,
          requiresAuth: true,
          children: [
            {
              label: 'Déconnexion',
              action: 'logout',
              icon: LogOut
            }
          ]
        }
      ]
    }
  },

  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen
      this.recipesOpen = true
      this.accountOpen = true
    },

    toggleRecipes() {
      this.recipesOpen = !this.recipesOpen
      this.accountOpen = false
    },

    toggleAccount() {
      this.accountOpen = !this.accountOpen
      this.recipesOpen = false
    },

    closeMenus() {
      this.menuOpen = false
      this.recipesOpen = false
      this.accountOpen = false
    },

    async logout() {
      try {
        await api.get('/auth/logout')
        this.auth.user_data = null
        this.closeMenus()
        await this.$router.push('/')
      } catch (err) {
        console.error('Erreur lors de la déconnexion :', err)
      }
    }
  }
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0.5rem;
  background: rgba(15, 23, 42, 0.97);
  backdrop-filter: blur(8px);
  color: #f8fafc;
}

.logo {
  color: #f8fafc;
  font-size: 1.3rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 1.0rem;
}

.nav-item {
  position: relative;
}

.nav-button,
.login-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.8rem;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: #f8fafc;
  font: inherit;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
}

.nav-button:hover,
.login-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.chevron {
  font-size: 0.8rem;
  opacity: 0.8;
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 10;
  display: none;
  padding: 0.4rem;
  border: 1px solid #334155;
  border-radius: 8px;
  background: #1e293b;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

.nav-item:hover .dropdown,
.nav-item:focus-within .dropdown,
.dropdown.is-open {
  display: flex;
  flex-direction: column;
}

.dropdown a,
.dropdown-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  white-space: nowrap;
  padding: 0.7rem 0.8rem;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: #f8fafc;
  font: inherit;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
}

.dropdown a:hover,
.dropdown-action:hover {
  background: #334155;
}

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 42px;
  height: 42px;
  padding: 9px;
  border: 1px solid #475569;
  border-radius: 7px;
  background: transparent;
  cursor: pointer;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 2px;
  border-radius: 2px;
  background: #f8fafc;
  transition: transform 0.2s, opacity 0.2s;
}

.hamburger.active span:first-child {
  transform: translateY(7px) rotate(45deg);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:last-child {
  transform: translateY(-7px) rotate(-45deg);
}

.drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1001;
  background: rgba(0, 0, 0, 0.55);
}

.mobile-drawer {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1002;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: min(320px, 85vw);
  height: 100dvh;
  padding: 1.25rem;
  overflow-y: auto;
  background: #0f172a;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.2);
  transform: translateX(100%);
  visibility: hidden;
  transition: transform 0.25s ease, visibility 0.25s;
}

.mobile-drawer.is-open {
  transform: translateX(0);
  visibility: visible;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 1px solid #334155;
}

.drawer-title {
  font-size: 1.2rem;
  font-weight: 700;
}

.close-button {
  padding: 0.4rem 0.6rem;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: #f8fafc;
  font-size: 1.2rem;
  cursor: pointer;
}

.mobile-nav-item {
  border-bottom: 1px solid #334155;
}

.mobile-nav-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 0.3rem;
  border: 0;
  background: transparent;
  color: #f8fafc;
  font: inherit;
  font-weight: 500;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
}

.mobile-submenu {
  display: flex;
  flex-direction: column;
  padding: 0 0 0.7rem 0.8rem;
}

.mobile-submenu a,
.mobile-submenu .dropdown-action {
  padding: 0.75rem;
  color: #cbd5e1;
  font: inherit;
  text-align: left;
  text-decoration: none;
}

.nav-button,
.login-button,
.dropdown-action,
.mobile-nav-button {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.dropdown-action {
  width: 100%;
}

.mobile-submenu a:hover,
.close-button:hover {
  color: #fff;
  background: #1e293b;
}

@media (max-width: 768px) {
  .navbar {
    padding: 0.65rem 1rem;
  }

  .desktop-nav {
    display: none;
  }

  .hamburger {
    display: flex;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hamburger span,
  .mobile-drawer {
    transition: none;
  }
}
</style>
