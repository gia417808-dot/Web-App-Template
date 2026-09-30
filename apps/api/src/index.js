"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var express_1 = require("express");
var auth_audit_1 = require("@web-app-template/auth-audit");
var kv01_1 = require("./routes/kv01");
var app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.use(auth_audit_1.tenantMiddleware);
app.get('/health', function (req, res) {
    res.send('OK');
});
app.get('/ready', function (req, res) {
    res.send('Ready');
});
app.use('/api/kv01', kv01_1.default);
