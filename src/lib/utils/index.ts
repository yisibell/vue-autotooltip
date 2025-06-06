import { css } from 'fourdom'
import { computePosition, offset, flip, shift, arrow, inline, autoUpdate } from '@floating-ui/dom'
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

export const getOptions = (bindingValue?: TooltipBindingValue): Required<TooltipOptions> => {
  const defaultOptions: Required<TooltipOptions> = {
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

  const middleware = [offset(6), flip(), shift({ padding: 5 }), inline()]

  if (showArrow) {
    middleware.push(arrow({ element: arrowElement }))
  }

  const placement = options.placement
  const isLightTheme = options.effect === 'light'

  computePosition(ref, tooltip, {
    placement,
    middleware
  }).then(({ x, y, placement, middlewareData }) => {
    // arrow direction
    const arrowStaticSide = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right'
    }[placement.split('-')[0]]

    const offsetY = options.offset[1]
    const offsetX = options.offset[0]

    const finalOffsetY =
      arrowStaticSide === 'top' ? +offsetY : arrowStaticSide === 'bottom' ? -offsetY : 0

    const finalOffsetX =
      arrowStaticSide === 'right' ? -offsetX : arrowStaticSide === 'left' ? +offsetX : 0

    Object.assign(tooltip.style, {
      left: `${x + finalOffsetX}px`,
      top: `${y + finalOffsetY}px`
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

      if (arrowStaticSide) {
        Object.assign(arrowElement.style, {
          [arrowStaticSide]: isLightTheme
            ? `-${options.arrowWidth / 2}px`
            : `-${options.arrowWidth}px`
        })

        if (arrowStaticSide === 'bottom') {
          arrowElement.classList.add('down')
        } else if (arrowStaticSide === 'top') {
          arrowElement.classList.add('up')
        } else if (arrowStaticSide === 'left') {
          arrowElement.classList.add('left')
        } else if (arrowStaticSide === 'right') {
          arrowElement.classList.add('right')
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
  }
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
