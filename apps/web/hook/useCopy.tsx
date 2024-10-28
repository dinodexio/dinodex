import { useState } from 'react';

// Định nghĩa kiểu trả về cho hook
type UseCopyReturn = [boolean, (text: string) => Promise<void>];

function useCopy(): UseCopyReturn {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);

            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy text: ', error);
            setIsCopied(false);
        }
    };

    return [isCopied, copyToClipboard];
}

export default useCopy;
