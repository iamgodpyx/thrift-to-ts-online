const metrics = {
    emitCounter(_v: string, _count: number) {}
}

const HTMLMetrics = {
    success: () => metrics.emitCounter('html.request.success', 1),
    fail: () => metrics.emitCounter('html.request.fail', 1),
    input: () => metrics.emitCounter('html.request.input', 1)
}

const validateMetrics = {
    input: () => metrics.emitCounter('validate.input', 1),
    pass: () => metrics.emitCounter('validate.pass', 1),
    fail: () => metrics.emitCounter('validate.fail', 1)
}

export default metrics
export { HTMLMetrics, validateMetrics }
