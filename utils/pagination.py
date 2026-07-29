import math 

def paginate(query, page:int = 1, limit:int = 10):
    total = query.count()
    offset = (page -1) * limit
    data = (
        query.offset(offset).limit(limit).all()
    )
    return {
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": math.ceil(total / limit) if limit else 0,
        "data": data,
    }