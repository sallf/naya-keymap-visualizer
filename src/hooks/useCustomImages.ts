const STORAGE_KEY = 'naya-keymap-custom-images'

function getAll(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveAll(images: Record<string, string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(images))
}

export function saveCustomImage(dataUrl: string): string {
  const images = getAll()
  const id = `img_${Date.now()}`
  images[id] = dataUrl
  saveAll(images)
  return id
}

export function getCustomImage(id: string): string | null {
  const images = getAll()
  return images[id] ?? null
}

export function deleteCustomImage(id: string) {
  const images = getAll()
  delete images[id]
  saveAll(images)
}
