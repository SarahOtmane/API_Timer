# Utiliser l'image Node.js officielle
FROM node:lts-slim

# Créer un dossier de travail
WORKDIR /home/node/app/api/

# Copier le package.json et package-lock.json
COPY ./api/package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Compiler le code TypeScript
RUN npm install

# Exposer le port (par exemple 3000)
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["node", "dist/app.js"]
