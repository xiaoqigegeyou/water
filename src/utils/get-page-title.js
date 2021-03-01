import defaultSettings from '@/settings'

const title = defaultSettings.title || '纯净水预定系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
