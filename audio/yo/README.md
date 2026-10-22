# Greeting recordings — awaiting native-speaker review

No audio recordings are included yet. The app offers an explicitly experimental device-speech tester while native recordings are pending. It prefers an available Yoruba voice. If there is none, users must explicitly select another voice for playback testing; the page warns that non-Yoruba voices are not pronunciation guides. No missing MP3s are requested.

Record each phrase separately, with a fluent Yoruba speaker first checking the written phrase, tone marks and intended meaning. Keep natural pitch and pace. Supply MP3 files, trim excessive silence, avoid background music, and obtain the speaker’s permission to publish in this public repository.

| Filename | Current lesson text (review before recording) | Meaning |
| --- | --- | --- |
| greeting-morning.mp3 | Ẹ kú òwúrọ̀ | Good morning |
| greeting-afternoon.mp3 | Ẹ káàsán | Good afternoon |
| greeting-evening.mp3 | Ẹ kú àṣalẹ́ | Good evening |
| greeting-welcome.mp3 | Ẹ káàbọ̀ | Welcome |
| greeting-goodbye.mp3 | O dàbọ̀ | Goodbye |

## Activation

1. Upload reviewed MP3s into this directory. If the reviewer corrects the text, update the corresponding lesson item too.
2. Record speaker permission, reviewer and review date here.
3. Change `ready:false` to `ready:true` for each supplied clip in `GREETING_AUDIO` in index.html. Leave missing/unreviewed clips false.
4. Run `node --test tests/audio.test.cjs`.
5. On iPhone Safari and Android Chrome, check Listen, replay, rapid switching between phrases, navigation during playback, and a missing-file error. Audio failure must not deduct hearts or block lessons.

Natural-speed playback is the first milestone. Add separately reviewed slow recordings later; do not change pitch to simulate slow speech. No API key or backend is required.

## Device speech test
Open Hello and goodbye, select a device voice, and tap Test speech beside a greeting. Normal/slower speed, replay, Stop and Refresh voices are available. Voice availability depends on the device/browser. Speech stops on navigation or hiding the page. This is not validated native Yoruba audio.
