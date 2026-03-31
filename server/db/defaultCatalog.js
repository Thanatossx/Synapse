import crypto from "crypto";

/** Eski store.js ile aynı varsayılan başvuru formu şablonu */
export function defaultQuestionList() {
  return [
    {
      id: `q-${crypto.randomUUID()}`,
      type: "text",
      label: "Merhaba Raver, adın ne?",
      required: true,
      placeholder: "Yanıtınız",
    },
    {
      id: `q-${crypto.randomUUID()}`,
      type: "text",
      label: "Telefon Numaranız",
      required: false,
      placeholder: "Yanıtınız",
    },
    {
      id: `q-${crypto.randomUUID()}`,
      type: "date",
      label: "Doğum Tarihiniz (Etkinlik 18+ olduğu için gereklidir)",
      required: false,
    },
    {
      id: `q-${crypto.randomUUID()}`,
      type: "select",
      label: "Kaç bilet almak istiyorsunuz? Biletler $170.",
      required: true,
      options: [
        { value: "one", label: "Sadece bir tane." },
        { value: "two", label: "İki tane alacağım." },
        { value: "more", label: "İki taneden fazla alacağım." },
      ],
    },
    {
      id: `q-${crypto.randomUUID()}`,
      type: "textarea",
      label: "Kimlerle geliyorsunuz? (İsimler veya kısa bilgi)",
      required: false,
      placeholder: "Yanıtınız",
    },
    {
      id: `q-${crypto.randomUUID()}`,
      type: "multiselect",
      label: "Etkinlik hakkında nereden haberdar oldunuz?",
      required: true,
      options: [
        { value: "social", label: "Sosyal Medya (Facebrowser)" },
        { value: "friend", label: "Arkadaş Tavsiyesi" },
        { value: "other", label: "Diğer" },
      ],
    },
    {
      id: `q-${crypto.randomUUID()}`,
      type: "rules_ack",
      label: "Etkinlik kurallarını okudum ve kabul ediyorum.",
      required: true,
    },
  ];
}

export function defaultEventsSeed() {
  return [
    {
      id: "ev-1",
      title: "FREQUENCY404",
      description: "Sinyal kayıp. Gerçeklik bulunamadı.",
      image:
        "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/websites/uploaded-media/SYNAPSE2-uFSvwHlnlYjl8pfdxwURClyTb1Qo67.png",
      status: "active",
    },
    {
      id: "ev-2",
      title: "XXX?",
      description: "YAKINDA.",
      image:
        "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/websites/uploaded-media/synapse3-1SER7inZRxEcRCRvRybKRcO4tKtOFS.png",
      status: "active",
    },
    {
      id: "ev-3",
      title: "???",
      description: "YAKINDA.",
      image:
        "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/websites/uploaded-media/SYNAPSE4-g0vnE3qsctrnIv8pBBI5yXbdv4qEp1.png",
      status: "active",
    },
    {
      id: "ev-4",
      title: "???",
      description: "YAKINDA.",
      image:
        "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/websites/uploaded-media/SYNAPSE1-91oTScrRJJNkuJOUzUBmrby9biro2C.png",
      status: "past",
    },
    {
      id: "ev-5",
      title: "???",
      description: "YAKINDA.",
      image:
        "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/websites/uploaded-media/SYNAPSE5-AAFo4Fe9ojRitjBLmOv2hEMUisnzfl.png",
      status: "past",
    },
  ];
}

export function defaultBraceletsSeed() {
  return [
    {
      id: "br-1",
      title: "SYNAX - Black Kandi Bracelet",
      description:
        "Organizatörler veya sahneye yakın VIP'ler. Ortamı yöneten lead raverler.",
      image:
        "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/websites/uploaded-media/tcIpKCE-VLezQH7wzgmVYIW7kSsXzzSsb7kEF2.png",
    },
    {
      id: "br-2",
      title: "SYNAX - Red Kandi Bracelet",
      description:
        "İlişki aramayanlar, yalnız takılmak isteyenler için sınır belirten bileklik.",
      image:
        "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/websites/uploaded-media/M45nIT6-nM358VI29Cao6nve0lDjlQimiLQcVK.png",
    },
    {
      id: "br-3",
      title: "SYNAX - Blue Kandi Bracelet",
      description:
        "Sadece cinsel açıdan etkileşim arayanlar için görsel iletişim rengi.",
      image:
        "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/websites/uploaded-media/LwBebdY-IVBWAPbqikW8o9rYbBOeRCBetLutBJ.png",
    },
    {
      id: "br-4",
      title: "SYNAX - Green Kandi Bracelet",
      description:
        "İlişki arayan, PLUR ruhunu benimseyen ve pozitif enerji yayan kişiler.",
      image:
        "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/websites/uploaded-media/4QGakqA-u3gFcf0me8WEJY4FgmccvCbG2Dgukk.png",
    },
    {
      id: "br-5",
      title: "SYNAX - Rainbow Kandi Bracelet",
      description: "Açık fikirli, her türlü enerjiyi ve çeşitliliği kucaklayanlar.",
      image:
        "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/websites/uploaded-media/Untitled%20%283%29-81v2qKX1fdasnJlnsfWLlEDcDwWn6h.png",
    },
    {
      id: "br-6",
      title: "SYNAX - Yellow Kandi Bracelet",
      description:
        "İlk kez rave deneyimi yaşayanlar veya yeni katılımcılar için destek rengi.",
      image:
        "https://rjdavx8ozyznxeyh.public.blob.vercel-storage.com/production/websites/uploaded-media/Untitled%20%284%29-n5daAsQ2my9ZeQQCTJtI7M6zvdkM9h.png",
    },
  ];
}
