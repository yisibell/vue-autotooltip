export const formatLibName = (source: string, libName = 'vue-autotooltip') =>
  source.replace('@/lib/main', libName).replace('@/lib/interfaces/core', libName)
