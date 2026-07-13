from pathlib import Path

from langchain_community.document_loaders import PyPDFLoader


class DocumentLoader:

    def load_documents(
        self,
        folder="documents"
    ):

        docs = []

        pdf_folder = Path(folder)

        for pdf in pdf_folder.glob("*.pdf"):

            loader = PyPDFLoader(str(pdf))

            docs.extend(
                loader.load()
            )

        return docs


document_loader = DocumentLoader()