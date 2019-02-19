// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var products_pb = require('./products_pb.js');

function serialize_products_GetProduct(arg) {
  if (!(arg instanceof products_pb.GetProduct)) {
    throw new Error('Expected argument of type products.GetProduct');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_products_GetProduct(buffer_arg) {
  return products_pb.GetProduct.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_products_Product(arg) {
  if (!(arg instanceof products_pb.Product)) {
    throw new Error('Expected argument of type products.Product');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_products_Product(buffer_arg) {
  return products_pb.Product.deserializeBinary(new Uint8Array(buffer_arg));
}


var productsService = exports.productsService = {
  get_product: {
    path: '/products.products/get_product',
    requestStream: false,
    responseStream: false,
    requestType: products_pb.GetProduct,
    responseType: products_pb.Product,
    requestSerialize: serialize_products_GetProduct,
    requestDeserialize: deserialize_products_GetProduct,
    responseSerialize: serialize_products_Product,
    responseDeserialize: deserialize_products_Product,
  },
};

exports.productsClient = grpc.makeGenericClientConstructor(productsService);
