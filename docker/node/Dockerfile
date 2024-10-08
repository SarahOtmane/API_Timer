# Utiliser l'image Node.js officielle
FROM node:lts-slim

# Créer un dossier de travail
WORKDIR /home/node/app/api/

# Copier le package.json et package-lock.json
COPY ./api/package.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY ./api/ ./

# Exposer le port (par exemple 3000)
EXPOSE 3000

RUN npm run build

# Commande pour démarrer l'application
CMD ["npm", "run", "dev"]
