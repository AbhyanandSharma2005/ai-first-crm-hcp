from langchain_text_splitters import RecursiveCharacterTextSplitter


class DocumentSplitter:

    def __init__(self):

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