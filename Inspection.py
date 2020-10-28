# -*- coding: utf-8 -*-
from APIHelper import APIHelper
from Models import RSApublicKey, AuthResponse
from asn1crypto import x509
from Crypto import PublicKey
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5
import os, json, base64
from flask import Flask
from flask import request
from flask_cors import CORS
import sys    
sys.stdout.reconfigure(encoding='utf-8')

class InspectionResults():
    def inspectionResult():

        #변수 세팅
        API_KEY					= "97cac8242dba4ef7932ee5edaea6a066"							
        IDENTITY_NUMBER			= ""						#주민등록번호
        CERT_PASSWORD			= ""							#인증서 비밀번호
        PHONE_NUMBER			= ""							#핸드폰 번호
        DIR_PATH				= r"C:\Users\82104\AppData\LocalLow\NPKI\yessign\USER\cn=0020045201505113070126,ou=WOORI,ou=personal4IB,o=yessign,c=kr" #인증서 경로 폴더

        #API헬퍼 초기화
        apiHelper				= APIHelper(API_KEY)

        #RSA 공개키 요청
        rsaPubResultStr			= apiHelper.getRSAPubKey()
        rsaPubResult			= RSApublicKey()
        rsaPubResult.__dict__	= json.loads(rsaPubResultStr)
        print("rsaPubResult : {}".format(rsaPubResultStr))

        # RSA공개로 AES키 암호화
        cert					= x509.Certificate.load(base64.b64decode(rsaPubResult.PublicKey))
        n						= cert.public_key.native["public_key"]["modulus"]
        e						= cert.public_key.native["public_key"]["public_exponent"]
        rsaPubCipher			= PublicKey.RSA.construct((n, e))
        cipher					= PKCS1_v1_5.new(rsaPubCipher.publickey())
        aesCipheredKey			= cipher.encrypt(apiHelper._aes.key)

        _certFilePath			= DIR_PATH + os.path.sep + "signCert.der"
        _keyFilePath			= DIR_PATH + os.path.sep + "signPri.key"
           
        #진단받은 질환 조회
        myInspection 			= apiHelper.getMYInspection(aesCipheredKey, _certFilePath, _keyFilePath, IDENTITY_NUMBER, CERT_PASSWORD, PHONE_NUMBER)
        myInspectionResults = json.loads(myInspection)

        print(myInspectionResults)

InspectionResults.inspectionResult()