export const regexFilter = (filters = {}, options = { caseInsensitive: true }) => {
    const result = {}
    const regexOptions = options.caseInsensitive ? 'i' : ''
    for (const [key, value] of Object.entries(filters)) {
      const trimmedValue = typeof value === 'string' ? value.trim() : null
  
      if (key && trimmedValue) {
        result[key] = { $regex: trimmedValue, $options: regexOptions }
      }
    }
  
    return result
  }