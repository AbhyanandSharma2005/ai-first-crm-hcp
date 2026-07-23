class DocumentSplitter:

    def __init__(self):
        # Lazy import: langchain_text_splitters.__init__ eagerly imports
        # SentenceTransformersTokenTextSplitter → sentence_transformers → torch,
        # which is blocked by Windows Application Control. Importing inside
        # __init__ means it only runs when DocumentSplitter is first instantiated,
        # but since module-level `document_splitter = DocumentSplitter()` still
        # runs at import time, we inline the splitter creation lazily instead.
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


document_splitter = DocumentSplitter()


def split_documents(documents):
    """
    Convenience wrapper.
    """
    return document_splitter.split_documents(documents)