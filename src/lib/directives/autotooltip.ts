import type { DirectiveBinding } from 'vue'
import { computePosition, offset, flip, shift, arrow, inline } from '@floating-ui/dom'
import type {
  TooltipBindingValue,
  TooltipReferenceElement,
  UpdatePositionFn,
  ShowTooltipFn,
  AutotooltipDirective,
  TooltipOptions
} from '@/lib/interfaces/core'
import { css } from 'fourdom'

const getOptions = (bindingValue?: TooltipBindingValue): Required<TooltipOptions> => {
  const defaultOptions: Required<TooltipOptions> = {
    content: '',
    appendTo: document.body,
    effect: 'dark',
    placement: 'top',
    arrowWidth: 8
  }

  return typeof bindingValue === 'string' || !bindingValue
    ? defaultOptions
    : Object.assign(defaultOptions, bindingValue)
}

const updatePosition: UpdatePositionFn = (ref, tooltip, opts) => {
  const options = getOptions(opts?.bindingValue)
  const arrowElement = opts?.arrowElement

  const middleware = [offset(6), flip(), shift({ padding: 5 }), inline()]

  if (arrowElement) {
    middleware.push(arrow({ element: arrowElement }))
  }

  const placement = options.placement

  computePosition(ref, tooltip, {
    placement,
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

      Object.assign(arrowElement.style, {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        right: '',
        bottom: ''
      })

      // arrow direction
      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right'
      }[placement.split('-')[0]]

      if (staticSide) {
        Object.assign(arrowElement.style, {
          [staticSide]: `-${options.arrowWidth / 2}px`
        })

        if (staticSide === 'bottom') {
          Object.assign(arrowElement.style, {
            'border-bottom': 'var(--autotooltip-theme-border--light)',
            'border-right': 'var(--autotooltip-theme-border--light)'
          })
        } else if (staticSide === 'top') {
          Object.assign(arrowElement.style, {
            'border-left': 'var(--autotooltip-theme-border--light)',
            'border-top': 'var(--autotooltip-theme-border--light)'
          })
        } else if (staticSide === 'left') {
          Object.assign(arrowElement.style, {
            'border-left': 'var(--autotooltip-theme-border--light)',
            'border-bottom': 'var(--autotooltip-theme-border--light)'
          })
        } else if (staticSide === 'right') {
          Object.assign(arrowElement.style, {
            'border-top': 'var(--autotooltip-theme-border--light)',
            'border-right': 'var(--autotooltip-theme-border--light)'
          })
        }
      }
    }
  })
}

const showTooltip: ShowTooltipFn = (ref, tooltip, opts) => {
  tooltip.style.display = 'block'
  updatePosition(ref, tooltip, opts)
}

function hideTooltip(tooltip: HTMLElement) {
  tooltip.style.display = ''
}

const createTooltipElement = (content: string, opts: TooltipBindingValue) => {
  const options = getOptions(opts)
  const themeClassName = `is-${options.effect}`

  const wrapper = document.createElement('div')

  css(wrapper, {
    '--autotooltip-arrow--width': `${options.arrowWidth}px`
  })

  wrapper.classList.add('autotooltip-wrapper')
  wrapper.classList.add(themeClassName)

  wrapper.innerHTML = `${content}<div class="autotooltip__arrow ${themeClassName}"></div>`

  return wrapper
}

function isOverflowing(element: HTMLElement) {
  return element.scrollWidth > element.offsetWidth
}

export const Autotooltip: AutotooltipDirective = {
  bind(el) {
    el._init = (el: TooltipReferenceElement, binding: DirectiveBinding<TooltipBindingValue>) => {
      const options = getOptions(binding.value)

      const targetParent =
        typeof options.appendTo === 'string'
          ? document.querySelector(options.appendTo) || document.body
          : options.appendTo

      const bindingContent =
        typeof binding.value === 'string' ? binding.value : binding.value?.content
      const content = bindingContent || el.innerText

      if (el?._tooltipEl) {
        targetParent.removeChild(el._tooltipEl)
      }

      const tooltipEl = createTooltipElement(content, binding.value)
      targetParent.appendChild(tooltipEl)
      el._tooltipEl = tooltipEl
      el._tooltipArrowEl = tooltipEl.querySelector<HTMLElement>('.autotooltip__arrow')

      el._showTooltipListener = () => {
        if ((bindingContent || isOverflowing(el)) && el._tooltipEl) {
          showTooltip(el, el._tooltipEl, {
            arrowElement: el._tooltipArrowEl,
            bindingValue: binding.value
          })
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
    el.classList.add('autotooltip--text-truncate')
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
