class DocumentSplitter:

    def __init__(self):
        # Lazy import: import RecursiveCharacterTextSplitter directly
        # This avoids the langchain_text_splitters.__init__ import chain
        # that pulls in SentenceTransformersTokenTextSplitter -> sentence_transformers -> torch
        from langchain_text_splitters import RecursiveCharacterTextSplitter

        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=800,
            chunk_overlap=150
        )

    def split_documents(
        self,
        documents
    ):
        return self.splitter.split_documents(
            documents
        )


_splitter = None

def split_documents(documents):
    """
    Convenience wrapper that lazily initializes the splitter.
    """
    global _splitter
    if _splitter is None:
        _splitter = DocumentSplitter()
    return _splitter.split_documents(documents)