export function checkPasswordStrength(password) {
    const minLength = 8;
    const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
        password
    );

    if (password.length < minLength) {
        return 'Password must be at least ' + minLength + ' characters long.';
    }
    if (!hasSpecialCharacter) {
        return 'Password must contain at least one special character.';
    }

    return null;
}
