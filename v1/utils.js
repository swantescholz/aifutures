const clamp01 = x => Math.min(1.0, Math.max(0.0, x));
const toPercentString = p => (p*100).toFixed((p*100 < 10.0) ? 1 : 0);
function toAlpha(p) {
    if (document.getElementById('transparentPathsCheckbox').checked) {
        return interpolateFast(p, 0.2, 1.0);
    }
    return 1.0;
}
function toArrowWidth(p) {
    if (document.getElementById('boldPathsCheckbox').checked) {
        return Math.round(interpolateFast(p, 1, 5));
    }
    return 2;
}
function toArrowHeadLen(p) {
    if (document.getElementById('boldPathsCheckbox').checked) {
        return Math.round(interpolateFast(p, 8, 25));
    }
    return 12;
}
function toNodeBorderWidth(p) {
    if (document.getElementById('boldPathsCheckbox').checked) {
        return Math.round(interpolateFast(p, 1, 5));
    }
    return 2;
}
function toFontWeight(p) {
    if (document.getElementById('boldPathsCheckbox').checked) {
        return Math.round(interpolateFast(p, 100, 900));
    }
    return 400;
}
function interpolateFast(p, min, max) {
    p = clamp01(p);
    p = Math.sqrt(1.0-(1-p)*(1-p)); // fast-in circle function
    return min + (max - min) * p; // linear interpolation between min and max
}

function copyUrlToClipboard() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(function() {
        alert('URL copied to clipboard');
    }, function(err) {
        alert('Failed to copy URL to clipboard');
    });
}
function shareOnFacebook() {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${getUrl()}`;
    window.open(fbUrl, '_blank');
}
function shareOnTwitter() {
    const twUrl = `https://twitter.com/intent/tweet?&url=${getUrl()}`;
    window.open(twUrl, '_blank');
}
function getUrl() {
    return encodeURIComponent(window.location.href);
    // return encodeURIComponent('https://swantescholz.github.io/aidoom/v1.html');
}
function mycheck(value, message) {
    if (value === null || value === undefined) {
        throw new Error('Value is null or undefined. Error message: ' + message);
    }
}