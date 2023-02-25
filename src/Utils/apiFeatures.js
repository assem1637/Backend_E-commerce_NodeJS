class ApiFeatures {


    constructor(MongooseQuery, QueryString) {

        this.MongooseQuery = MongooseQuery;
        this.QueryString = QueryString;

    };


    pagination() {

        // 1- Pagination

        let page = (this.QueryString.page * 1 > 0 ? this.QueryString.page * 1 : 1) || 1;
        let limit = 10;
        let skip = (page - 1) * limit;

        this.MongooseQuery.skip(skip).limit(limit);
        this.page = page;

        return this;

    };



    filter() {

        // 2- Filter

        let Query = { ...this.QueryString };
        let Query_Not_Use = ["page", "sort", "fields", "keyword"];

        Query_Not_Use.forEach((ele) => {

            delete Query[ele];

        });


        Query = JSON.stringify(Query);
        Query = Query.replace(/(gte|gt|lte|lt)/g, (match) => `$${match}`);
        Query = JSON.parse(Query);

        this.MongooseQuery.find(Query);

        return this;

    };




    sort() {


        // 3- Sort

        if (this.QueryString.sort) {

            let value_of_query_sort = (this.QueryString.sort).split(",").join(" ");
            this.MongooseQuery.sort(value_of_query_sort);

        };


        return this;

    };



    fields() {


        // 4- Select

        if (this.QueryString.fields) {

            let value_of_query_fields = (this.QueryString.fields).split(",").join(" ");
            this.MongooseQuery.select(value_of_query_fields);

        };


        return this;

    };



    search() {


        // 5- Search

        if (this.QueryString.keyword) {

            this.MongooseQuery.find({ $or: [{ name: { $regex: this.QueryString.keyword, $options: "i" } }, { description: { $regex: this.QueryString.keyword, $options: "i" } }] });

        };


        return this;

    };


};


export default ApiFeatures;