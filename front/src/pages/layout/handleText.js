export default function handleText(textObj, language) {
    if (language in textObj)
        return textObj[language]
    return ""
}