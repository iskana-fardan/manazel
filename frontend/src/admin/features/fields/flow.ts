// FLOW DIALOG

// User isi input
//       ↓
// React Hook Form simpan value secara internal (tanpa re-render)
//       ↓
// User klik submit
//       ↓
// handleSubmit() jalan
//       ↓
// zodResolver(fieldSchema) validasi data
//       ↓
// Kalau valid → onSubmit(data)
// Kalau error → errors diisi
//       ↓
// Error ditampilkan di TextField


// Mantap 🔥 sekarang kita masuk ke **mode guru serius tapi santai**.

// Lu jangan cuma bisa pakai RHF + Zod.
// Lu harus ngerti *cara mikirnya*. Karena ini fondasi buat semua form ke depan.

// ---

// # 🧠 GAMBAR BESAR DULU (Flow Besarnya)

// Alur kerja form lo sekarang itu begini:

// ```
// User isi input
//       ↓
// React Hook Form simpan value secara internal (tanpa re-render)
//       ↓
// User klik submit
//       ↓
// handleSubmit() jalan
//       ↓
// zodResolver(fieldSchema) validasi data
//       ↓
// Kalau valid → onSubmit(data)
// Kalau error → errors diisi
//       ↓
// Error ditampilkan di TextField
// ```

// Itu big picture-nya.

// Sekarang kita bedah pelan-pelan.

// ---

// # 🔥 1️⃣ Apa Itu React Hook Form (RHF)?

// Normalnya form React itu begini:

// ```tsx
// const [name, setName] = useState("")
// ```

// Masalahnya?

// * Tiap ketik → re-render
// * Banyak state
// * Ribet
// * Gak scalable

// ---

// ## RHF Cara Kerjanya Beda

// RHF itu pakai konsep:

// > **Uncontrolled input + ref**

// Artinya:

// * Input tidak dikontrol oleh state React
// * RHF menyimpan value di dalam sistem internalnya
// * Re-render jauh lebih sedikit

// Makanya performanya kenceng banget.

// ---

// # 🔥 2️⃣ useForm<FieldFormValues>()

// Ini bagian penting:

// ```ts
// useForm<FieldFormValues>()
// ```

// Artinya:

// > “Form ini bentuk datanya harus sesuai dengan FieldFormValues.”

// Dan `FieldFormValues` itu hasil dari:

// ```ts
// export type FieldFormValues = z.infer<typeof fieldSchema>;
// ```

// Artinya:

// > TypeScript type otomatis dibuat dari Zod schema.

// 🔥 Jadi schema dan type selalu sinkron.
// Gak bisa mismatch.

// Itu powerful banget.

// ---

// # 🔥 3️⃣ resolver: zodResolver(fieldSchema)

// Ini bagian paling penting.

// ```ts
// resolver: zodResolver(fieldSchema)
// ```

// Artinya:

// > “Setiap kali form disubmit, validasinya pakai schema ini.”

// Jadi yang terjadi waktu submit:

// ```
// handleSubmit()
//      ↓
// RHF kumpulin semua data input
//      ↓
// Kirim ke zodResolver
//      ↓
// Zod cek sesuai fieldSchema
// ```

// Kalau gagal:

// ```
// errors.name = "Name is required"
// ```

// Kalau lolos:

// ```
// data siap dikirim ke backend
// ```

// ---

// # 🔥 4️⃣ register("name")

// Ini inti RHF.

// ```tsx
// <TextField {...register("name")} />
// ```

// Apa yang terjadi?

// Register itu melakukan:

// 1. Menyambungkan input ke sistem RHF
// 2. Menyimpan ref
// 3. Menyimpan event handler
// 4. Tracking value

// Kalau gak ada `register`, RHF gak tahu input itu ada.

// ---

// # 🔥 5️⃣ errors.name?.message

// Bagian ini:

// ```tsx
// error={!!errors.name}
// helperText={errors.name?.message}
// ```

// Datanya dari mana?

// Dari Zod.

// Kalau schema bilang:

// ```ts
// name: z.string().min(1, "Name is required")
// ```

// Dan user kosongin name:

// ```
// errors.name.message = "Name is required"
// ```

// Makanya bisa langsung muncul di UI.

// ---

// # 🔥 6️⃣ handleSubmit(onSubmit)

// Ini sering bikin orang bingung.

// ```tsx
// <form onSubmit={handleSubmit(onSubmit)}>
// ```

// Jangan pikir ini cuma wrapper.

// Yang sebenarnya terjadi:

// ```
// handleSubmit = function (callback) {
//    return function (event) {
//       preventDefault()
//       validate with resolver
//       if valid → callback(data)
//    }
// }
// ```

// Jadi `onSubmit` lo:

// ```ts
// (data) => {
//    api.post("/fields", data)
// }
// ```

// Cuma dipanggil kalau data VALID.

// Kalau invalid?
// → callback gak dipanggil.

// ---

// # 🔥 7️⃣ valueAsNumber: true

// Ini penting banget.

// HTML input type number itu sebenarnya:

// ```
// "value" selalu string
// ```

// Kalau gak pakai ini:

// ```
// "order": "1"  ← string
// ```

// Schema lo expect number.

// Makanya kita pakai:

// ```tsx
// {...register("order", { valueAsNumber: true })}
// ```

// Artinya:

// > “Sebelum simpan ke RHF, convert ke number.”

// Ini clean banget dibanding pakai z.coerce.

// ---

// # 🔥 8️⃣ reset() dan useEffect()

// Ini bagian edit mode.

// ```ts
// useEffect(() => {
//   if (initialData) {
//     reset(initialData);
//   }
// }, [initialData]);
// ```

// Kenapa perlu reset?

// Karena:

// RHF hanya baca defaultValues saat pertama render.

// Kalau lo buka dialog edit:

// * initialData berubah
// * Tapi form tidak otomatis update

// Makanya harus pakai `reset()`.

// Reset itu artinya:

// > “Isi ulang semua value form dengan data ini.”

// ---

// # 🔥 Sekarang Gue Jelasin Flow Real Saat Lo Pakai Dialog

// ## ➜ Add Mode

// 1. initialData = null
// 2. reset ke empty default
// 3. User isi
// 4. Submit
// 5. Zod validasi
// 6. onSubmit(data)
// 7. Mutation jalan

// ---

// ## ➜ Edit Mode

// 1. Klik edit
// 2. selected di-set
// 3. initialData berubah
// 4. useEffect jalan
// 5. reset(initialData)
// 6. Form keisi otomatis
// 7. User edit
// 8. Submit
// 9. Validasi
// 10. update mutation

// ---

// # 🔥 Kenapa Pattern Ini Powerful Banget?

// Karena sekarang:

// ✅ Schema jadi source of truth
// ✅ TypeScript otomatis sync
// ✅ Validasi frontend dan backend bisa mirror
// ✅ Form scalable
// ✅ Clean
// ✅ Maintainable

// ---

// # 🎯 Inti Besarnya

// Sekarang mindset lo harus berubah:

// ❌ “Form = banyak useState”
// ✅ “Form = schema-driven”

// ---

// # 🧠 Analogi Biar Makin Paham

// Bayangin:

// Zod = Polisi aturan
// RHF = Manajer form
// Resolver = Penerjemah antara polisi dan manajer
// register = Kabel yang menghubungkan input ke sistem

// User isi → Manajer kumpulin → Polisi cek →
// Lolos? → Kirim
// Gagal? → Kasih error

// ---

// # 🚀 Sekarang Pertanyaan Buat Lo

// Biar gue tahu lo beneran ngerti:

// Kalau kita HAPUS resolver, tapi tetap pakai register — apa yang terjadi?

// Coba jawab dulu.

// Kalau lo bisa jawab itu, berarti lo udah ngerti 70% RHF 😎










// =================== FLOW PAGE ==============================================
// ============================================================================
// Baik, murid MERN 🔥
// Sekarang kita bedah **FieldsPage** sampai lo ngerti relasi antar bagian.

// Gue jelasin dalam 3 layer:

// 1. 🧠 Big Architecture
// 2. 🔁 Flow lengkap dari klik sampai ke backend
// 3. 🔗 Hubungannya dengan RHF & Zod

// ---

// # 🧠 1️⃣ GAMBAR BESAR ARSITEKTUR

// FieldsPage itu **orchestrator**.

// Dia bukan yang:

// * ❌ Validasi form
// * ❌ Ngatur input
// * ❌ Ngerender TextField

// Dia cuma:

// > 🧠 Mengatur state halaman + komunikasi server + buka/tutup dialog

// Kalau kita mapping:

// ```
// FieldsPage
//  ├── FieldHeader (button add)
//  ├── FieldsTable (lihat data)
//  └── FieldDialog (form input)
// ```

// Jadi:

// * Dialog fokus ke FORM
// * Page fokus ke DATA & API

// Separation of concern ✔

// ---

// # 🧠 2️⃣ State Lokal Halaman

// ```ts
// const [open, setOpen] = useState(false);
// const [selected, setSelected] = useState<Field | null>(null);
// ```

// ### open

// Ngatur apakah dialog kebuka atau tidak.

// ### selected

// Menentukan:

// * null → Add mode
// * ada object → Edit mode

// Ini penting banget karena ini yang menentukan flow di dialog.

// ---

// # 🔁 3️⃣ useQuery — Fetch Data

// ```ts
// const { data = [] } = useQuery<Field[]>({
//   queryKey: ["fields"],
//   queryFn: async () => {
//     const { data } = await api.get("/fields");
//     return data;
//   },
// });
// ```

// Flow:

// ```
// Component mount
//     ↓
// useQuery jalan
//     ↓
// GET /fields
//     ↓
// Data masuk ke cache React Query
//     ↓
// data tersedia
// ```

// React Query:

// * Simpan cache
// * Handle loading
// * Handle error
// * Auto refetch kalau invalidated

// ---

// # 🔥 4️⃣ useMutation — Create

// ```ts
// const createMutation = useMutation({
//   mutationFn: (payload: FieldFormValues) =>
//     api.post("/fields", payload),
// ```

// Kenapa payload typed `FieldFormValues`?

// Karena itu type dari Zod.

// Artinya:

// > Data yang keluar dari FieldDialog sudah pasti sesuai schema.

// Jadi:

// * RHF validasi
// * Zod validasi
// * TypeScript jamin bentuknya

// Itu koneksi langsung antara Zod ↔ React Query.

// ---

// # 🔥 5️⃣ updateMutation

// ```ts
// mutationFn: (payload: FieldFormValues) =>
//   api.put(`/fields/${selected?._id}`, payload),
// ```

// Perhatiin ini:

// selected dipakai di dalam mutation.

// Flow edit:

// ```
// Klik edit
//    ↓
// setSelected(field)
//    ↓
// Dialog buka
//    ↓
// User submit
//    ↓
// handleSubmit
//    ↓
// updateMutation.mutate(data)
// ```

// ---

// # 🔥 6️⃣ deleteMutation

// Mirip create/update, cuma tanpa RHF karena gak ada form.

// ---

// # 🔁 7️⃣ handleSubmit

// Ini titik pertemuan antara:

// FieldDialog (RHF)
// dan
// FieldsPage (React Query)

// ```ts
// const handleSubmit = (data: FieldFormValues) => {
//   if (selected) {
//     updateMutation.mutate(data);
//   } else {
//     createMutation.mutate(data);
//   }
// };
// ```

// Data ini dari mana?

// 👉 Dari FieldDialog
// 👉 Dari handleSubmit(onSubmit) RHF
// 👉 Sudah tervalidasi Zod

// Jadi alurnya:

// ```
// User klik submit
//    ↓
// RHF handleSubmit
//    ↓
// Zod validasi
//    ↓
// Kalau valid → onSubmit(data)
//    ↓
// FieldsPage.handleSubmit(data)
//    ↓
// Mutation jalan
// ```

// Ini flow paling penting.

// ---

// # 🔗 8️⃣ Hubungan FieldDialog ↔ FieldsPage

// Di bawah ini titik koneksi:

// ```tsx
// <FieldDialog
//   open={open}
//   onClose={() => {
//     setOpen(false);
//     setSelected(null);
//   }}
//   onSubmit={handleSubmit}
//   initialData={selected}
//   loading={
//     createMutation.isPending || updateMutation.isPending
//   }
// />
// ```

// Mari kita breakdown:

// ---

// ## 🧠 initialData={selected}

// Ini yang menentukan:

// selected = null → Add
// selected = object → Edit

// Dan di dialog ada:

// ```ts
// useEffect(() => {
//   if (initialData) {
//     reset(initialData);
//   }
// }, [initialData]);
// ```

// Jadi:

// selected berubah → dialog reset → form keisi

// ---

// ## 🧠 onSubmit={handleSubmit}

// Ini yang bikin dialog gak tahu apa-apa soal API.

// Dialog cuma tahu:

// ```
// Submit → kirim data
// ```

// Yang ngurus API itu page.

// Ini clean architecture.

// ---

// ## 🧠 loading prop

// ```ts
// loading={
//   createMutation.isPending || updateMutation.isPending
// }
// ```

// Artinya:

// Kalau mutation lagi jalan:
// → tombol disable
// → spinner muncul

// UI reactive terhadap state async.

// ---

// # 🔥 9️⃣ invalidateQueries

// Ini penting banget.

// ```ts
// queryClient.invalidateQueries({ queryKey: ["fields"] });
// ```

// Artinya:

// > “Cache data fields sudah gak valid, ambil ulang dari server.”

// Flow setelah create/update/delete:

// ```
// Mutation sukses
//    ↓
// Invalidate
//    ↓
// useQuery refetch
//    ↓
// Table update
// ```

// Tanpa ini, table gak update.

// ---

// # 🧠 Sekarang Gue Rangkumin Flow Penuh (End-to-End)

// ## ADD FLOW

// Klik Add
// ↓
// setSelected(null)
// ↓
// Dialog open
// ↓
// User isi
// ↓
// RHF kumpulin data
// ↓
// Zod validasi
// ↓
// handleSubmit(data)
// ↓
// createMutation
// ↓
// POST /fields
// ↓
// invalidate
// ↓
// useQuery refetch
// ↓
// Table update

// ---

// ## EDIT FLOW

// Klik Edit
// ↓
// setSelected(field)
// ↓
// Dialog open
// ↓
// reset(initialData)
// ↓
// User edit
// ↓
// RHF
// ↓
// Zod
// ↓
// updateMutation
// ↓
// PUT /fields/:id
// ↓
// invalidate
// ↓
// refetch
// ↓
// Table update

// ---

// # 🧠 Apa Hubungan Langsung Dengan RHF & Zod di Page Ini?

// Secara langsung:

// Hanya di sini:

// ```ts
// mutationFn: (payload: FieldFormValues)
// ```

// Kenapa penting?

// Karena itu bikin:

// Type form = Type API payload

// Kalau lo ubah schema Zod:
// Type ini otomatis berubah.

// Kalau mismatch:
// TypeScript teriak.

// Itu keamanan level tinggi.

// ---

// # 🔥 Kenapa Pattern Ini Profesional?

// Karena:

// * Form logic dipisah
// * Data fetching dipisah
// * Mutation dipisah
// * Validasi terpusat
// * Type terpusat
// * UI terpisah dari business logic

// Ini pattern yang dipakai di production SaaS.

// ---

// # 🧠 Pertanyaan Buat Ngetes Lo Lagi

// Kalau kita pindahin mutation ke dalam FieldDialog, apa yang terjadi secara arsitektur?

// Kenapa itu bukan best practice?

// Jawab dulu.
// Kalau lo bisa jawab ini, berarti lo sudah naik level.
