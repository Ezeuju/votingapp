FROM node:22.15.1-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

# Install Infisical CLI
RUN apt-get update && \
    apt-get install -y curl && \
    curl -1sLf 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' | bash && \
    apt-get install -y infisical

COPY . .

EXPOSE 3072

CMD sh -c "infisical run --env=dev --projectId=$INFISICAL_PROJECT_ID --token=$INFISICAL_TOKEN -- npm run uat"