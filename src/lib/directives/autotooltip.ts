import type { DirectiveBinding } from 'vue'
import type {
  TooltipBindingValue,
  TooltipReferenceElement,
  AutotooltipDirective
} from '@/lib/interfaces/core'
import {
  getOptions,
  createTooltipElement,
  showTooltip,
  hideTooltip,
  isOverflowing,
  clearEvent,
  updatePosition,
  getTargetParent,
  showTooltipWithCreate
} from '@/lib/utils'
import { autoUpdate } from '@floating-ui/dom'

export const Autotooltip: AutotooltipDirective = {
  created(el, binding) {
    el._init = (el: TooltipReferenceElement, binding: DirectiveBinding<TooltipBindingValue>) => {
      const opts = getOptions(binding.value)

      clearEvent(el)

      if (opts.disabled) {
        hideTooltip(el)
        return
      }

      if (opts.trigger === 'hover') {
        el._showTooltipListener = () => {
          const options = getOptions(binding.value)

          const targetParent = getTargetParent(options)

          if (!targetParent) return

          const bindingContent =
            typeof binding.value === 'string' ? binding.value : binding.value?.content
          const content = bindingContent || el.innerText

          const isNeedShowTooltip = !!bindingContent || isOverflowing(el)

          if (el?._tooltipEl) {
            targetParent.removeChild(el._tooltipEl)
          }

          const tooltipEl = createTooltipElement(content, binding.value)

          tooltipEl.addEventListener('mouseenter', () => {
            el._isHovered = true
          })

          tooltipEl.addEventListener('mouseleave', () => {
            el._isHovered = false
            setTimeout(() => {
              if (!el._isHovered) {
                hideTooltip(el)
              }
            }, 100) // 延迟隐藏
          })

          targetParent.appendChild(tooltipEl)
          el._tooltipEl = tooltipEl
          el._tooltipArrowEl = tooltipEl.querySelector<HTMLElement>('.autotooltip__arrow')

          if (isNeedShowTooltip && el._tooltipEl) {
            el.style.textOverflow = 'ellipsis'

            el._isHovered = true

            showTooltip(el, el._tooltipEl, {
              arrowElement: el._tooltipArrowEl,
              bindingValue: binding.value
            })
          } else {
            el.style.textOverflow = 'clip'
          }

          el._cleanup = autoUpdate(el, el._tooltipEl, () => {
            if (el._tooltipEl) {
              updatePosition(el, el._tooltipEl, {
                arrowElement: el._tooltipArrowEl,
                bindingValue: binding.value
              })
            }
          })
        }

        el._hideTooltipListener = () => {
          el._isHovered = false

          setTimeout(() => {
            if (!el._isHovered) {
              hideTooltip(el)
            }
          }, 100) // 延迟隐藏
        }

        el.addEventListener('mouseenter', el._showTooltipListener)
        el.addEventListener('mouseleave', el._hideTooltipListener)
      } else if (opts.trigger === 'click') {
        el._clickTooltipListener = () => {
          el._visible = !el._visible

          if (!el._visible) {
            hideTooltip(el)
          } else {
            showTooltipWithCreate({
              target: el,
              bindingValue: binding.value
            })

            if (opts.duration > 0) {
              el._autoHideTimer = setTimeout(() => {
                hideTooltip(el)
              }, opts.duration)
            }
          }
        }

        el._clickOutsideListener = (e: Event) => {
          const target = e.target as HTMLElement

          if (target !== el && target !== el._tooltipEl && target !== el._tooltipArrowEl) {
            hideTooltip(el)
          }
        }

        el.addEventListener('click', el._clickTooltipListener)

        document.addEventListener('click', el._clickOutsideListener)
      }
    }

    el._init(el, binding)
  },
  mounted(el, binding) {
    const options = getOptions(binding.value)

    if (options.trigger === 'hover') {
      el.classList.add('autotooltip--text-truncate')
    }
  },
  updated(el, binding) {
    const options = getOptions(binding.value)

    if (options.trigger === 'hover') {
      el.style.textOverflow = 'ellipsis'
    }

    if (el._init) {
      el._init(el, binding)
    }
  },
  unmounted(el) {
    hideTooltip(el)

    clearEvent(el)
  },
  getSSRProps() {
    return {}
  }
}
