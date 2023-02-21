const { width, marginL, marginR, left, right, maxWidth, borderR, borderL, contentBox, minFullHeight, autoHeight } = require("./constants");
const {
  convertPropValue,
  hasIgnoreComments,
  round,
} = require("./logic-helper");

const postcss = require("postcss");

function appendDemoContent(selector, rule, desktopViewAtRule, landScapeViewAtRule, disableDesktop, disableLandscape, disableMobile) {
  if (!disableMobile) {
    rule.append({
      prop: "content",
      value: "'✨Portrait✨'",
    });
  }
  if (!disableDesktop) {
    desktopViewAtRule.append(postcss.rule({ selector }).append({
      prop: "content",
      value: "'✨Desktop✨'",
    }));
  }
  if (!disableLandscape) {
    landScapeViewAtRule.append(postcss.rule({ selector }).append({
      prop: "content",
      value: "'✨Landscape✨'",
    }));
  }
}

/** 居中最外层选择器，用 margin 居中，有 border */
function appendMarginCentreRootClassWithBorder(selector, disableDesktop, disableLandscape, {
  desktopViewAtRule,
  landScapeViewAtRule,
  sharedAtRult,
  desktopWidth,
  landscapeWidth,
  borderColor,
}) {
  if (disableDesktop && !disableLandscape) {
    // 仅移动端横屏
    landScapeViewAtRule.append(postcss.rule({ selector }).append(maxWidth(landscapeWidth), marginL, marginR, contentBox, borderL(borderColor), borderR(borderColor), minFullHeight, autoHeight));
  } else if (disableLandscape && !disableDesktop) {
    // 仅桌面
    desktopViewAtRule.append(postcss.rule({ selector }).append(maxWidth(desktopWidth), marginL, marginR, contentBox, borderL(borderColor), borderR(borderColor), minFullHeight, autoHeight));
  } else if (!disableDesktop && !disableLandscape) {
    // 桌面和移动端横屏
    desktopViewAtRule.append(postcss.rule({ selector }).append(maxWidth(desktopWidth)));
    landScapeViewAtRule.append(postcss.rule({ selector }).append(maxWidth(landscapeWidth)));
    sharedAtRult.append(postcss.rule({ selector }).append(marginL, marginR, contentBox, borderL(borderColor), borderR(borderColor), minFullHeight, autoHeight));
  }
}

/** fixed 的百分百宽度转换为居中的固定宽度（预期的桌面端和移动端横屏宽度） */
function appendFixedFullWidthCentre(selector, disableDesktop, disableLandscape, {
  desktopWidth,
  landscapeWidth,
  desktopViewAtRule,
  landScapeViewAtRule,
  sharedAtRult,
}) {
  if (!disableDesktop && !disableLandscape) {
    // 桌面端和移动端横屏
    desktopViewAtRule.append(postcss.rule({ selector }).append(width(desktopWidth)));
    landScapeViewAtRule.append(postcss.rule({ selector }).append(width(landscapeWidth)));
    sharedAtRult.append(postcss.rule({ selector }).append(marginL, marginR, left, right));
  } else if (disableDesktop && !disableLandscape) {
    // 仅移动端横屏
    landScapeViewAtRule.append(postcss.rule({ selector }).append(width(landscapeWidth), marginL, marginR, left, right));
  } else if (disableLandscape && !disableDesktop) {
    // 仅桌面端
    desktopViewAtRule.append(postcss.rule({ selector }).append(width(desktopWidth), marginL, marginR, left, right));
  }

}

/** 100vw 转换为固定宽度（预期的桌面端和移动端横屏宽度） */
function appendStaticWidthFromFullVwWidth(selector, disableDesktop, disableLandscape, {
  desktopWidth,
  landscapeWidth,
  desktopViewAtRule,
  landScapeViewAtRule,
}) {
  if (!disableDesktop) {
    desktopViewAtRule.append(postcss.rule({ selector }).append(width(desktopWidth)));
  }
  if (!disableLandscape) {
    landScapeViewAtRule.append(postcss.rule({ selector }).append(width(landscapeWidth)));
  }
}

/** 转换属性 left 和 right 的媒体查询值 */
function appendLeftRightMediaRadioValueFromPx(selector, decl, disableDesktop, disableLandscape, disableMobile, isFixed, {
  viewportWidth,
  desktopRadio,
  landscapeRadio,
  desktopViewAtRule,
  landScapeViewAtRule,
  pass1px,
  unitPrecision,
  satisfiedPropList,
  fontViewportUnit,
  blackListedSelector,
  replace,
  result,
  viewportUnit,
  desktopWidth,
  landscapeWidth
}) {
  const prop = decl.prop;
  const val = decl.value;
  const important = decl.important;
  appendMediaRadioPxOrReplaceMobileVwFromPx(selector, prop, val, disableDesktop, disableLandscape, disableMobile, {
    viewportWidth,
    desktopRadio,
    landscapeRadio,
    desktopViewAtRule,
    landScapeViewAtRule,
    important,
    pass1px,
    decl,
    unitPrecision,
    satisfiedPropList,
    fontViewportUnit,
    blackListedSelector,
    replace,
    result,
    viewportUnit,
    convertMobile: (pxNum, pxUnit) => {
      const fontProp = prop.includes("font");
      const is1px = pass1px && pxNum === 1;
      const n = is1px ? 1 : round(pxNum * 100 / viewportWidth, unitPrecision)
      const mobileUnit = is1px ? pxUnit : fontProp ? fontViewportUnit : viewportUnit;
      return `${n}${mobileUnit}`
    },
    convertDesktop: pxNum => {
      const is1px = pass1px && pxNum === 1;
      const roundedCalc = is1px ? 1 : round(desktopWidth / 2 - pxNum * desktopRadio, unitPrecision)
      const roundedPx = is1px ? 1 : round(pxNum * desktopRadio, unitPrecision)
      return isFixed ? `calc(50vw - ${roundedCalc}px)` : `${roundedPx}px`
    },
    convertLandscape: pxNum => {
      const is1px = pass1px && pxNum === 1;
      const roundedCalc = is1px ? 1 : round(landscapeWidth / 2 - pxNum * landscapeRadio, unitPrecision)
      const roundedPx = is1px ? 1 : round(pxNum * landscapeRadio, unitPrecision)
      return isFixed ? `calc(50vw - ${roundedCalc})` : `${roundedPx}px`
    },
  });
}

/** px 值，转换为媒体查询中比例计算的 px，替换为移动端竖屏视口单位 */
function appendMediaRadioPxOrReplaceMobileVwFromPx(selector, prop, val, disableDesktop, disableLandscape, disableMobile, {
  desktopViewAtRule,
  landScapeViewAtRule,
  important,
  pass1px,
  decl,
  unitPrecision,
  satisfiedPropList,
  fontViewportUnit,
  blackListedSelector,
  replace,
  result,
  viewportUnit,
  convertLandscape,
  convertDesktop,
  convertMobile,
}) {
  const ignore = hasIgnoreComments(decl, result);

  const enabledDesktop = !disableDesktop && satisfiedPropList && !blackListedSelector && !ignore;
  const enabledLandscape = !disableLandscape && satisfiedPropList && !blackListedSelector && !ignore;
  const enabledMobile = !disableMobile && satisfiedPropList && !blackListedSelector && !ignore;

  if (enabledDesktop || enabledLandscape || enabledMobile) {
    const { mobile, desktop, landscape } = convertPropValue(prop, val, {
      enabledMobile,
      enabledDesktop,
      enabledLandscape,
      viewportUnit, fontViewportUnit, pass1px, unitPrecision,
      convertMobile,
      convertDesktop,
      convertLandscape,
    });

    if (enabledMobile) {
      if (replace)
        decl.value = mobile;
      else
        decl.after(decl.clone({ value: mobile }));
    }
    if (enabledDesktop) {
      if (val !== desktop) {
        desktopViewAtRule.append(postcss.rule({ selector }).append({
          prop: prop, // 属性
          value: desktop, // 替换 px 比例计算后的值
          important, // 值的尾部有 important 则添加
        }));
      }
    }
    if (enabledLandscape) {
      if (val !== landscape) {
        landScapeViewAtRule.append(postcss.rule({ selector }).append({
          prop,
          value: landscape,
          important,
        }));
      }
    }
  }
}

/** 居中最外层选择器，margin 居中，无 border */
function appendMarginCentreRootClassNoBorder(selector, disableDesktop, disableLandscape, {
  desktopViewAtRule,
  landScapeViewAtRule,
  sharedAtRult,
  desktopWidth,
  landscapeWidth
}) {
  if (disableDesktop && !disableLandscape) {
    // 仅移动端横屏
    landScapeViewAtRule.append(postcss.rule({ selector }).append(maxWidth(landscapeWidth), marginL, marginR));
  } else if (disableLandscape && !disableDesktop) {
    // 仅桌面
    desktopViewAtRule.append(postcss.rule({ selector }).append(maxWidth(desktopWidth), marginL, marginR));
  } else if (!disableDesktop && !disableLandscape) {
    // 桌面和移动端横屏
    desktopViewAtRule.append(postcss.rule({ selector }).append(maxWidth(desktopWidth)));
    landScapeViewAtRule.append(postcss.rule({ selector }).append(maxWidth(landscapeWidth)));
    sharedAtRult.append(postcss.rule({ selector }).append(marginL, marginR));
  }
}


module.exports = {
  appendMarginCentreRootClassWithBorder,
  appendFixedFullWidthCentre,
  appendStaticWidthFromFullVwWidth,
  appendMediaRadioPxOrReplaceMobileVwFromPx,
  appendMarginCentreRootClassNoBorder,
  appendDemoContent,
  appendLeftRightMediaRadioValueFromPx,
};