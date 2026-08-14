from pydantic import BaseModel , ConfigDict, HttpUrl
from enum import Enum
from typing import Optional


class CompanySize(str, Enum):
    ONE_TO_TEN = "1-10"
    ELEVEN_TO_FIFTY = "11-50"
    FIFTY_ONE_TO_TWO_HUNDRED = "51-200"
    TWO_HUNDRED_ONE_TO_FIVE_HUNDRED = "201-500"
    FIVE_HUNDRED_ONE_TO_THOUSAND = "501-1000"
    THOUSAND_PLUS = "1000+" 


class Industry(str, Enum):
    INFORMATION_TECHNOLOGY = "Information Technology"
    FINANCE = "Finance"
    HEALTHCARE = "Healthcare"
    EDUCATION = "Education"
    E_COMMERCE = "E-Commerce"
    MANUFACTURING = "Manufacturing"
    CONSULTING = "Consulting"
    OTHER = "Other"

class CompanyBase(BaseModel):
    name:str
    description:str 
    website:Optional[str] 
    industry:str 
    company_size:CompanySize
    location:str 
    logo:Optional[str] = None

class CompanyCreate(CompanyBase):
    pass
class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    website: Optional[HttpUrl] = None
    industry: Optional[str] = None
    company_size: Optional[CompanySize] = None
    location: Optional[str] = None
    logo: Optional[str] = None

class CompanyResponse(CompanyBase):
    id: int
    

    model_config = ConfigDict(from_attributes=True)

class PaginatedCompanyResponse(BaseModel):
    page: int
    limit: int
    total: int
    total_pages: int
    data:list[CompanyResponse]

    

