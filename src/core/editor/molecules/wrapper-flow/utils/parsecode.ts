const getBaseCodeBlock = (codeString: string) => {
    const firstIndex = codeString.indexOf('{');
    const lastIndex = codeString.lastIndexOf('}');
    return codeString.substring(firstIndex, lastIndex + 1);
}
export { getBaseCodeBlock };