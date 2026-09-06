En développement

Tu gardes exactement le workflow classique :

frontend/
    npm run dev
        ↓
    Vite :5173

et :

backend/
    node index.js
        ↓
    Fastify :3000

Donc tu peux continuer à développer comme avant. se connecter sur https://localhost:5173 pour le frontend et https://localhost:3000 pour le backend. 
