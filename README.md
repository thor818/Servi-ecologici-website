# Servizi Ecologici · Notizie dal pianeta

Il giornale online sull'ambiente di Servizi Ecologici: ogni mattina le notizie ecologiche più
importanti dal mondo, scritte in italiano con le fonti sempre citate.

## Come funziona

- Gli articoli sono file di testo in `articoli/` (uno per notizia).
- `python3 build.py` genera il sito statico nella cartella `docs/`, che viene pubblicata online.
- Ogni mattina un agente automatico cerca le notizie, scrive gli articoli seguendo
  [AGENTE.md](AGENTE.md) e apre una pull request «Edizione del giorno».
  **Per pubblicarla basta fare il merge della pull request.**

## Modifiche a mano

- Correggere un articolo: modifica il file in `articoli/`, poi esegui `python3 build.py`.
- Nome, motto, indirizzo del sito, email e sezioni: `config.json`.
- Testo della pagina «Chi siamo»: `chi-siamo.md`.
- Grafica: `static/style.css`.

## Sito Brizon Gym

La cartella `brizon/` contiene il sito Brizon Gym, pubblicato su Vercel (https://brizon-gym.vercel.app)
tramite `vercel.json`. Non cancellarla: il giornale usa solo `docs/` e non la tocca.
