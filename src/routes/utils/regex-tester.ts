import express from 'express'

const router = express.Router()

const commonPatterns = {
    email: '[^@]+@[^.]+\\.[a-zA-Z]{2,}',
    url: 'https?:\\/\\/[\\w.-]+',
    date: '\\d{2}-\\d{2}-\\d{4}'
}

function suggestImprovements(pattern: string) {
    const suggestions = []
    for (const [description, commonPattern] of Object.entries(commonPatterns)) {
        if (pattern.includes(commonPattern)) {
            suggestions.push(`Your regex seems to be attempting to match ${description}. Consider using the common pattern: ${commonPattern}`)
        }
    }
    if (pattern.includes('(a|b|c|d|e|f|g|h|i|j|k)')) {
        suggestions.push('Consider simplifying (a|b|c|d|e|f|g|h|i|j|k) to [a-k].')
    }
    if (pattern.includes('(.*){1,1000}')) {
        suggestions.push('Your regex might be susceptible to catastrophic backtracking. Consider revising it.')
    }
    return suggestions
}

router.post('/', (request: express.Request, response: express.Response) => {
    try {
        const pattern: string = String(request.body.pattern || '').trim()
        const strings: string[] = request.body.strings instanceof Array ? request.body.strings.map(String) : []
        if (!pattern) return response.status(400).json({ error: 'Missing regex pattern' })
        if (strings.length === 0) return response.status(400).json({ error: 'No strings provided' })
        let regex: RegExp
        try {
            regex = new RegExp(pattern, pattern.includes('g') ? undefined : 'g')
        } catch (error: any) {
            const suggestions = suggestImprovements(pattern)
            return response.status(400).json({
                error: `Invalid regex pattern: ${error.message}. Please review your pattern.`,
                suggestions
            })
        }
        if (!regex.flags.includes('g')) {
            return response.status(400).json({ error: 'Regex pattern must have the global (g) flag' })
        }
        const results = strings.map(testString => {
            const matches = Array.from(testString.matchAll(regex))
            return {
                string: testString,
                matches: matches.map(match => ({
                    fullMatch: match[0],
                    groups: match.slice(1)
                }))
            }
        })
        const suggestions = suggestImprovements(pattern)
        if (suggestions.length > 0) response.json({ pattern, results, suggestions })
        else response.json({ pattern, results })
    } catch (error: any) {
        console.error(`Error testing regex (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to test regex' })
    }
})

export default router