export function searchQ (s = '') {
    const s_ = s.replace(/\?/g, '');
    return new Map(s_.split('&').map((s__) => s__.split('=')));
}