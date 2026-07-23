from pathlib import Path


class DocumentLoader:

    def load_documents(
        self,
        folder="documents"
    ):
        # Lazy import: avoids triggering langchain_core → langchain_text_splitters
        # → sentence_transformers → torch import chain at server startup.
        from langchain_community.document_loaders import PyPDFLoader

        docs = []

        pdf_folder = Path(folder)

        for pdf in pdf_folder.glob("*.pdf"):

            loader = PyPDFLoader(str(pdf))

            docs.extend(
                loader.load()
            )

        return docs


document_loader = DocumentLoader()