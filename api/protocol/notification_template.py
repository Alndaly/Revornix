import schemas
from typing import Protocol

class NotificationTemplate(Protocol):
    
    def __init__(self, 
                 template_id: int,
                 template_name: str,
                 template_version: str,
                 template_description: str | None = None,
                 template_name_zh: str | None = None,
                 template_description_zh: str | None = None):
        self.template_id = template_id
        self.template_name = template_name
        self.template_description = template_description
        self.template_version = template_version
        self.template_name_zh = template_name_zh
        self.template_description_zh = template_description_zh
        
    async def generate(self) -> schemas.notification.Message:
        raise NotImplementedError("Not implemented")