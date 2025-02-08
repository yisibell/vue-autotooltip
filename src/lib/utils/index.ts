import { css } from 'fourdom'
import { computePosition, offset, flip, shift, arrow, inline } from '@floating-ui/dom'
import type {
  TooltipBindingValue,
  UpdatePositionFn,
  ShowTooltipFn,
  TooltipOptions,
  TooltipReferenceElement
} from '@/lib/interfaces/core'

export const getOptions = (bindingValue?: TooltipBindingValue): Required<TooltipOptions> => {
  const defaultOptions: Required<TooltipOptions> = {
    content: '',
    appendTo: document.body,
    effect: 'dark',
    placement: 'top',
    arrowWidth: 8,
    showArrow: true
  }

  return typeof bindingValue === 'string' || !bindingValue
    ? defaultOptions
    : Object.assign(defaultOptions, bindingValue)
}

export const updatePosition: UpdatePositionFn = (ref, tooltip, opts) => {
  const options = getOptions(opts?.bindingValue)
  const arrowElement = opts?.arrowElement
  const showArrow = options.showArrow && arrowElement

  const middleware = [offset(6), flip(), shift({ padding: 5 }), inline()]

  if (showArrow) {
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

    if (showArrow) {
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

export const showTooltip: ShowTooltipFn = (ref, tooltip, opts) => {
  tooltip.style.display = 'block'
  updatePosition(ref, tooltip, opts)
}

export function hideTooltip(tooltip: HTMLElement) {
  tooltip.style.display = ''
}

export const createTooltipElement = (content: string, opts: TooltipBindingValue) => {
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

export function isOverflowing(element: HTMLElement) {
  return element.scrollWidth > element.offsetWidth
}

export const updateTextOverflow = (el: TooltipReferenceElement) => {
  if (isOverflowing(el)) {
    el.style.textOverflow = 'ellipsis'
  } else {
    el.style.textOverflow = 'clip'
  }
}

export const generateId = function () {
  return Math.floor(Math.random() * 10000)
}

export const clearEvent = (el: TooltipReferenceElement) => {
  if (el._showTooltipListener) {
    el.removeEventListener('mouseenter', el._showTooltipListener)
  }

  if (el._hideTooltipListener) {
    el.removeEventListener('mouseleave', el._hideTooltipListener)
  }

  if (el._cleanup) {
    el._cleanup()
  }
}
