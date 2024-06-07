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
  updatePosition
} from '@/lib/utils'
import { autoUpdate } from '@floating-ui/dom'

export const Autotooltip: AutotooltipDirective = {
  bind(el, binding) {
    el._init = (el: TooltipReferenceElement, binding: DirectiveBinding<TooltipBindingValue>) => {
      clearEvent(el)

      el._showTooltipListener = () => {
        const options = getOptions(binding.value)

        const targetParent =
          typeof options.appendTo === 'string'
            ? document.querySelector(options.appendTo) || document.body
            : options.appendTo

        const bindingContent =
          typeof binding.value === 'string' ? binding.value : binding.value?.content
        const content = bindingContent || el.innerText

        const isNeedShowTooltip = !!bindingContent || isOverflowing(el)

        if (el?._tooltipEl) {
          targetParent.removeChild(el._tooltipEl)
        }

        const tooltipEl = createTooltipElement(content, binding.value)
        targetParent.appendChild(tooltipEl)
        el._tooltipEl = tooltipEl
        el._tooltipArrowEl = tooltipEl.querySelector<HTMLElement>('.autotooltip__arrow')

        if (isNeedShowTooltip && el._tooltipEl) {
          el.style.textOverflow = 'ellipsis'
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
        if (el._tooltipEl) {
          hideTooltip(el._tooltipEl)
        }
      }

      el.addEventListener('mouseenter', el._showTooltipListener)
      el.addEventListener('mouseleave', el._hideTooltipListener)
    }

    el._init(el, binding)
  },
  inserted(el) {
    el.classList.add('autotooltip--text-truncate')
  },
  componentUpdated(el, binding) {
    el._init && el._init(el, binding)
  },
  unbind(el) {
    if (el._tooltipEl) {
      hideTooltip(el._tooltipEl)
    }

    clearEvent(el)
  }
}
