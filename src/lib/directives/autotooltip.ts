import type { ObjectDirective, DirectiveBinding } from 'vue'
import { computePosition, offset, flip, shift, arrow } from '@floating-ui/dom'
import type { TooltipBindingValue, TooltipReferenceElement } from '@/lib/interfaces/core'

function updatePosition(ref: HTMLElement, tooltip: HTMLElement, arrowElement?: HTMLElement | null) {
  const middleware = [offset(6), flip(), shift({ padding: 5 })]

  if (arrowElement) {
    middleware.push(arrow({ element: arrowElement }))
  }

  computePosition(ref, tooltip, {
    placement: 'top',
    middleware
  }).then(({ x, y, placement, middlewareData }) => {
    Object.assign(tooltip.style, {
      left: `${x}px`,
      top: `${y}px`
    })

    if (arrowElement) {
      // Accessing the data
      const arrowX = middlewareData.arrow?.x
      const arrowY = middlewareData.arrow?.y

      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right'
      }[placement.split('-')[0]]

      Object.assign(arrowElement.style, {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        right: '',
        bottom: ''
      })

      if (staticSide) {
        Object.assign(arrowElement.style, {
          [staticSide]: '-4px'
        })
      }
    }
  })
}

function showTooltip(ref: HTMLElement, tooltip: HTMLElement, arrowElement?: HTMLElement | null) {
  tooltip.style.display = 'block'
  updatePosition(ref, tooltip, arrowElement)
}

function hideTooltip(tooltip: HTMLElement) {
  tooltip.style.display = ''
}

const createTooltipElement = (content: string) => {
  const wrapper = document.createElement('div')
  wrapper.classList.add('autotooltip-wrapper')

  wrapper.innerHTML = `${content}<div class="autotooltip__arrow"></div>`

  return wrapper
}

export const Autotooltip: ObjectDirective<TooltipReferenceElement, TooltipBindingValue> = {
  bind(el) {
    el._init = (el: TooltipReferenceElement, binding: DirectiveBinding<TooltipBindingValue>) => {
      const targetParent = el.parentElement || document.body
      const content = binding.value?.content || el.innerText

      if (!el?._tooltipEl) {
        const tooltipEl = createTooltipElement(content)
        targetParent.appendChild(tooltipEl)
        el._tooltipEl = tooltipEl
        el._tooltipArrowEl = tooltipEl.querySelector('.autotooltip__arrow') as HTMLElement | null
      }

      el._showTooltipListener = () => {
        if (el._tooltipEl) {
          showTooltip(el, el._tooltipEl, el._tooltipArrowEl)
        }
      }

      el._hideTooltipListener = () => {
        if (el._tooltipEl) {
          hideTooltip(el._tooltipEl)
        }
      }

      el.addEventListener('mouseenter', el._showTooltipListener)
      el.addEventListener('mouseout', el._hideTooltipListener)
    }
  },
  inserted(el, binding) {
    el._init && el._init(el, binding)
  },
  update(el, binding) {
    el._init && el._init(el, binding)
  },
  unbind(el) {
    el._showTooltipListener && el.removeEventListener('mouseenter', el._showTooltipListener)
    el._hideTooltipListener && el.removeEventListener('mouseout', el._hideTooltipListener)
  }
}
