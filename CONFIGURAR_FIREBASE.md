# 🔥 Configurar Firebase — Time Leonel

Siga este guia passo a passo. Leva em torno de 10 minutos.

---

## PASSO 1 — Criar projeto no Firebase

1. Acesse **https://console.firebase.google.com**
2. Clique em **"Adicionar projeto"**
3. Nome: `time-leonel` → clique em Continuar
4. Desative o Google Analytics (não precisa) → **Criar projeto**
5. Aguarde e clique em **Continuar**

---

## PASSO 2 — Criar o banco de dados (Firestore)

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Selecione **"Iniciar no modo de teste"** ← importante!
4. Região: **southamerica-east1 (São Paulo)** → Ativar
5. Aguarde o banco ser criado

---

## PASSO 3 — Configurar regras de segurança

1. No Firestore, clique na aba **"Regras"**
2. Apague o conteúdo e cole exatamente isto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Clique em **Publicar**

> ✅ Estas regras permitem leitura e escrita públicas — correto para
> um app privado entre amigos. Para uso público seria necessário
> adicionar autenticação, mas para o Time Leonel está perfeito.

---

## PASSO 4 — Registrar o app Web

1. Na tela inicial do projeto, clique no ícone **`</>`** (Web)
2. Nome do app: `time-leonel-web` → **Registrar app**
3. **NÃO** marque "Firebase Hosting"
4. Copie o bloco `firebaseConfig` que aparecer:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXX",
  authDomain: "time-leonel.firebaseapp.com",
  projectId: "time-leonel",
  storageBucket: "time-leonel.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefgh"
};
```

---

## PASSO 5 — Colar configuração no index.html

Abra o arquivo `index.html` e encontre no início do `<script>`:

```javascript
const FIREBASE_CONFIG = {
  apiKey:            "COLE_SUA_API_KEY_AQUI",
  authDomain:        "COLE_SEU_AUTH_DOMAIN_AQUI",
  projectId:         "COLE_SEU_PROJECT_ID_AQUI",
  storageBucket:     "COLE_SEU_STORAGE_BUCKET_AQUI",
  messagingSenderId: "COLE_SEU_SENDER_ID_AQUI",
  appId:             "COLE_SEU_APP_ID_AQUI"
};
```

Substitua cada valor pelos dados copiados. Salve o arquivo.

---

## PASSO 6 — Publicar no GitHub Pages

1. Faça commit e push dos arquivos
2. Aguarde 1-2 minutos para o GitHub Pages atualizar
3. Abra o site no celular

---

## ✅ Como confirmar que funcionou

No header do app aparece um ícone de status:

| Ícone | Significado |
|-------|-------------|
| ⚙️ | Firebase não configurado (usando localStorage) |
| 🟢 | Online e sincronizado com Firebase |
| 🔴 | Offline — operações salvas, serão enviadas quando voltar |

---

## 🔄 Como funciona o modo offline

1. **Admin fica offline** → cadastros e sorteios são salvos localmente
2. **Admin volta online** → tudo é enviado automaticamente ao Firebase
3. **Viewers** recebem as atualizações em tempo real via `onSnapshot`
4. Um toast `☁️ X alteração(ões) sincronizada(s)!` confirma o envio

---

## 💰 Custos (Plano Gratuito — Spark)

| Recurso | Limite gratuito | Uso estimado |
|---------|-----------------|--------------|
| Leituras/dia | 50.000 | ~500 por sessão |
| Escritas/dia | 20.000 | ~50 por sessão |
| Armazenamento | 1 GB | < 1 MB |

**Conclusão: grátis para sempre** no nível de uso deste app.
