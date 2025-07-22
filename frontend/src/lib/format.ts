export function fmtDate(iso: string, locale = 'en-GB') {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(
      new Date(iso),
    )
  }
  