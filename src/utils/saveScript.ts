type saveScriptInput = {
  title: string;
  contentRef: React.RefObject<HTMLDivElement>;
  iconImage?: string;
};
export const saveScript = ({
  title,
  contentRef,
  iconImage,
}: saveScriptInput) => {
  if (
    title &&
    contentRef.current &&
    contentRef.current.innerHTML &&
    contentRef.current.innerHTML.length > 10
  ) {
    const payload = {
      content: contentRef.current.innerHTML,
      timestamp: Date.now(),
      iconImage,
    };
    localStorage.setItem(`script_${title}`, JSON.stringify(payload));
  }
};
