# MySpiritMic

Web app mobile-first per iPhone che usa realmente il microfono tramite Web Audio API.

## Funzioni

- spettro audio e forma d'onda in tempo reale
- livello RMS in dBFS e frequenza dominante
- modalità **Voce**, **Ampia** e **Sweep**
- marcatura automatica e manuale degli eventi
- registrazione tramite MediaRecorder
- esportazione dell'audio e del registro JSON
- funzionamento offline dopo il primo caricamento
- installazione sulla schermata Home dell'iPhone

## Pubblicazione

In **Settings → Pages**, scegliere:

- **Source:** Deploy from a branch
- **Branch:** main
- **Folder:** /(root)

Il sito sarà disponibile su:

https://ar-night.github.io/MySpiritMic/

## Uso su iPhone

Aprire il sito in Safari, premere **Attiva microfono** e consentire l'accesso. Per installarlo come app: **Condividi → Aggiungi alla schermata Home**.

> MySpiritMic analizza frequenze acustiche ambientali. Non riceve né scansiona frequenze radio AM/FM.
