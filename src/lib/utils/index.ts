import { css } from 'fourdom'
import { computePosition, offset, flip, shift, arrow, hide, inline, autoUpdate } from '@floating-ui/dom'
import type {
  TooltipBindingValue,
  UpdatePositionFn,
  ShowTooltipFn,
  TooltipOptions,
  TooltipReferenceElement
} from '@/lib/interfaces/core'

export const getTargetParent = (options: TooltipOptions) => {
  const targetParent =
    typeof options.appendTo === 'string'
      ? document.querySelector(options.appendTo) || document.body
      : options.appendTo

  return targetParent
}

export const setArrowDirection = (arrowElement: HTMLElement, direction: 'up' | 'down' | 'left' | 'right') => {
  const directions = ['up', 'down', 'left', 'roght']

  directions.filter(v => v !== direction).forEach(v => {
    arrowElement.classList.remove(v)
  })

  arrowElement.classList.add(direction)
}

export const getOptions = (bindingValue?: TooltipBindingValue): Required<TooltipOptions> => {
  const defaultOptions: Required<TooltipOptions> = {
    zIndex: 1024,
    offset: [0, 0],
    duration: 0,
    disabled: false,
    trigger: 'hover',
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
  const offsetY = options.offset[1]
  const offsetX = options.offset[0]

  const middleware = [
    offset({
    mainAxis: 10 + offsetX,
    crossAxis: 0 + offsetY
    }), 
    flip(), 
    shift({ padding: 5 }), 
    inline(),
    hide()
  ]

  if (showArrow) {
    middleware.push(arrow({ element: arrowElement }))
  }

  const placement = options.placement
  const isLightTheme = options.effect === 'light'

  computePosition(ref, tooltip, {
    placement,
    middleware
  }).then(({ x, y, placement, middlewareData }) => {

    if (middlewareData.hide) {
      Object.assign(tooltip.style, {
        visibility: middlewareData.hide.referenceHidden
          ? 'hidden'
          : 'visible',
      });
    }

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
      const arrowStaticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right'
      }[placement.split('-')[0]]


      if (arrowStaticSide) {
        Object.assign(arrowElement.style, {
          [arrowStaticSide]: isLightTheme
            ? `-${options.arrowWidth / 2}px`
            : `-${options.arrowWidth}px`
        })

        if (arrowStaticSide === 'bottom') {
          setArrowDirection(arrowElement, 'down')
        } else if (arrowStaticSide === 'top') {
          setArrowDirection(arrowElement, 'up')
        } else if (arrowStaticSide === 'left') {
          setArrowDirection(arrowElement, 'left')
        } else if (arrowStaticSide === 'right') {
          setArrowDirection(arrowElement, 'right')
        }
      }
    }
  })
}

export const showTooltip: ShowTooltipFn = (ref, tooltip, opts) => {
  tooltip.style.display = 'block'
  updatePosition(ref, tooltip, opts)
}

export function hideTooltip(el?: TooltipReferenceElement) {
  if (el) {
    if (el._autoHideTimer) {
      clearTimeout(el._autoHideTimer)

      el._autoHideTimer = null
    }

    if (el._tooltipEl) {
      el._visible = false
      el._tooltipEl.style.display = ''
    }

    if(el._cleanup) {
      el._cleanup()
    }
  }
}

export const createTooltipElement = (content: string, opts: TooltipBindingValue) => {
  const options = getOptions(opts)
  const themeClassName = `is-${options.effect}`

  const wrapper = document.createElement('div')

  css(wrapper, {
    '--autotooltip-arrow--width': `${options.arrowWidth}px`,
    '--autotooltip-theme-z-index': options.zIndex
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

  if (el._clickTooltipListener) {
    el.removeEventListener('click', el._clickTooltipListener)
  }

  if (el._clickOutsideListener) {
    document.removeEventListener('click', el._clickOutsideListener)
  }

  if (el._cleanup) {
    el._cleanup()
  }
}

export const showTooltipWithCreate = (opts: {
  target: TooltipReferenceElement
  bindingValue: TooltipBindingValue
}) => {
  const options = getOptions(opts.bindingValue)
  const el = opts.target

  const targetParent = getTargetParent(options)

  if (!targetParent) return

  if (el?._tooltipEl) {
    targetParent.removeChild(el._tooltipEl)
  }

  const content = options.content

  const tooltipEl = createTooltipElement(content, opts.bindingValue)

  targetParent.appendChild(tooltipEl)

  el._tooltipEl = tooltipEl
  el._tooltipArrowEl = tooltipEl.querySelector<HTMLElement>('.autotooltip__arrow')

  el._cleanup = autoUpdate(el, el._tooltipEl, () => {
    if (el._tooltipEl) {
      updatePosition(el, el._tooltipEl, {
        arrowElement: el._tooltipArrowEl,
        bindingValue: opts.bindingValue
      })
    }
  })

  showTooltip(el, el._tooltipEl, {
    arrowElement: el._tooltipArrowEl,
    bindingValue: opts.bindingValue
  })
}
