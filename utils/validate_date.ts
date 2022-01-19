const isValidDate = (date: string): boolean => {
  const re = /^\d{4}[-\/]\d{2}[-\/]\d{2}$/

  if (!re.test(date)) return false

  const parts = date.split(/[-\/]/)
  const day = +parts[2]
  const month = +parts[1]
  const year = +parts[0]

  if (year < 1000 || year > 3000 || month == 0 || month > 12) return false

  const dom = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  year % 400 == 0 || (year % 100 != 0 && year % 4 == 0) && (dom[1] = 29)

  return day > 0 && day <= dom[month - 1]
}

export default isValidDate
